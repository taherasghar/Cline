using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using vanrise_backend.Mappers;
using vanrise_backend.Models;

namespace vanrise_backend.Controllers
{
    [RoutePrefix("api/devices")]
    public class DeviceController : ApiController
    {
        private readonly string connectionString;

        public DeviceController()
        {
            connectionString = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
        }

        [HttpGet]
        [Route("getAll")]
        public IHttpActionResult GetAll()
        {
            var devices = new List<Devices>();

            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("GetAllDevices", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                connection.Open();
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    devices.Add(DeviceMapper.Map(reader));
                }
            }

            if (devices.Count == 0)
            {
                return Ok(devices);
            }
            return Ok(devices.OrderBy(d => d.Id).ToList());
        }

        [HttpPost]
        [Route("addDevice")]
        public IHttpActionResult AddDevice([FromBody] Devices newDevice)
        {
            if (newDevice == null)
            {
                return BadRequest("Invalid device data.");
            }

            // Check if the device name already exists
            if (IsDuplicateDeviceName(newDevice.Name))
            {
                return BadRequest("Device name already exists.");
            }

            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("AddDevice", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@Name", newDevice.Name);
                command.Parameters.AddWithValue("@IsAssigned", false);

                connection.Open();
                var result = command.ExecuteScalar();
                if (result != null && int.TryParse(result.ToString(), out int newId))
                {
                    newDevice.Id = newId;
                }
                else
                {
                    return InternalServerError(new Exception("Failed to retrieve the new device ID"));
                }
            }

            return Ok(newDevice);
        }

        [HttpPut]
        [Route("updateDevice")]
        public IHttpActionResult UpdateDevice([FromBody] Devices updatedDevice)
        {
            if (updatedDevice == null || updatedDevice.Id <= 0)
            {
                return BadRequest("Invalid device data.");
            }

            // Check if the device name already exists and is not the current device's name
            if (IsDuplicateDeviceName(updatedDevice.Name, updatedDevice.Id))
            {
                return BadRequest("Device name already exists.");
            }

            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("UpdateDevice", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@Id", updatedDevice.Id);
                command.Parameters.AddWithValue("@Name", updatedDevice.Name);

                connection.Open();
                int rowsAffected = command.ExecuteNonQuery();

                if (rowsAffected == 0)
                {
                    return NotFound();
                }
            }

            return Ok(updatedDevice);
        }

        [HttpGet]
        [Route("getFilteredDevices")]
        public IHttpActionResult GetFilteredDevices(string searchfilter)
        {
            var devices = new List<Devices>();

            using (var connection = new SqlConnection(connectionString))
            {
                SqlCommand command;

                if (string.IsNullOrWhiteSpace(searchfilter))
                {
                    command = new SqlCommand("GetAllDevices", connection)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                }
                else
                {
                    command = new SqlCommand("GetFilteredDevices", connection)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    command.Parameters.AddWithValue("@SearchFilter", searchfilter);
                }

                connection.Open();
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    devices.Add(DeviceMapper.Map(reader));
                }
            }

            if (devices.Count == 0)
            {
                return Ok(devices);
            }
            return Ok(devices.OrderBy(d => d.Id).ToList());
        }

        [HttpDelete]
        [Route("deleteDevice/{id}")]
        public IHttpActionResult DeleteDevice(int id)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("DeleteDevice", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@Id", id);

                connection.Open();
                int rowsAffected = command.ExecuteNonQuery();

                if (rowsAffected == 0)
                {
                    return NotFound();
                }
            }
            return Ok();
        }

        private bool IsDuplicateDeviceName(string deviceName, int? deviceId = null)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                var command = new SqlCommand("CheckDuplicateDeviceName", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@Name", deviceName);
                if (deviceId.HasValue)
                {
                    command.Parameters.AddWithValue("@Id", deviceId.Value);
                }

                int duplicateCount = (int)command.ExecuteScalar();

                return duplicateCount > 0;
            }
        }

        [HttpGet]
        [Route("getAssignedPhoneNumbersMap")]
        public IHttpActionResult GetAssignedPhoneNumbersMap()
        {
            var result = new Dictionary<int, List<AssignedPhoneNumber>>();

            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("GetAssignedPhoneNumbers", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };

                connection.Open();
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    int deviceId = (int)reader["DeviceId"];
                    int phoneNumberId = (int)reader["PhoneNumberId"];
                    string phoneNumber = reader["Number"].ToString();
                    bool isReserved = (bool)reader["IsReserved"];  // Read the IsReserved column

                    if (!result.ContainsKey(deviceId))
                    {
                        result[deviceId] = new List<AssignedPhoneNumber>();
                    }

                    result[deviceId].Add(new AssignedPhoneNumber
                    {
                        Id = phoneNumberId,
                        Number = phoneNumber,
                        IsReserved = isReserved  // Add the IsReserved property
                    });
                }
            }

            return Ok(result);
        }

        public class AssignedPhoneNumber
        {
            public int Id { get; set; }
            public string Number { get; set; }
            public bool IsReserved { get; set; }  // Add IsReserved property
        }

    }
}
