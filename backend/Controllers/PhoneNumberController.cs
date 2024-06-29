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
    [RoutePrefix("api/phoneNumbers")]
    public class PhoneNumberController : ApiController
    {
        private readonly string connectionString;

        public PhoneNumberController()
        {
            connectionString = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
        }

        [HttpGet]
        [Route("getAll")]
        public IHttpActionResult GetAll()
        {
            var phoneNumbers = new List<PhoneNumbers>();

            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("GetAllPhoneNumbers", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                connection.Open();
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    phoneNumbers.Add(PhoneNumberMapper.Map(reader));
                }
            }

            if (phoneNumbers.Count == 0)
            {
                return Ok(phoneNumbers);
            }
            return Ok(phoneNumbers.OrderBy(d => d.Id).ToList());
        }

        [HttpGet]
        [Route("getFilteredPhoneNumbers")]
        public IHttpActionResult GetFilteredPhoneNumbers(string searchfilter)
        {
            var phoneNumbers = new List<PhoneNumbers>();

            using (var connection = new SqlConnection(connectionString))
            {
                SqlCommand command;

                if (string.IsNullOrWhiteSpace(searchfilter))
                {
                    command = new SqlCommand("GetAllPhoneNumbers", connection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };
                }
                else
                {
                    command = new SqlCommand("GetFilteredPhoneNumbers", connection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };
                    command.Parameters.AddWithValue("@SearchFilter", searchfilter);
                }

                connection.Open();
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    phoneNumbers.Add(PhoneNumberMapper.Map(reader));
                }
            }

            if (phoneNumbers.Count == 0)
            {
                return Ok(phoneNumbers);
            }
            return Ok(phoneNumbers.OrderBy(d => d.Id).ToList());
        }

        private bool IsDuplicatePhoneNumber(string phoneNumber, int? phoneNumberId = null)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                var command = new SqlCommand("CheckDuplicatePhoneNumber", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@Number", phoneNumber);
                if (phoneNumberId.HasValue)
                {
                    command.Parameters.AddWithValue("@Id", phoneNumberId.Value);
                }

                int duplicateCount = (int)command.ExecuteScalar();

                return duplicateCount > 0;
            }
        }

        [HttpPut]
        [Route("update/{id}")]
        public IHttpActionResult UpdatePhoneNumber(int id, PhoneNumbers phoneNumber)
        {
            try
            {
                if (IsDuplicatePhoneNumber(phoneNumber.Number, id))
                {
                    return BadRequest("Phone number already exists.");
                }

                using (var connection = new SqlConnection(connectionString))
                {
                    var command = new SqlCommand("UpdatePhoneNumber", connection)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    command.Parameters.AddWithValue("@Id", id);
                    command.Parameters.AddWithValue("@Number", phoneNumber.Number);
                    connection.Open();
                    command.ExecuteNonQuery();

                    return Ok(phoneNumber);
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult AddPhoneNumber(PhoneNumbers phoneNumber)
        {
            try
            {
                if (IsDuplicatePhoneNumber(phoneNumber.Number))
                {
                    return BadRequest("Phone number already exists.");
                }

                using (var connection = new SqlConnection(connectionString))
                {
                    var command = new SqlCommand("AddPhoneNumber", connection)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    command.Parameters.AddWithValue("@Number", phoneNumber.Number);
                    command.Parameters.AddWithValue("@DeviceId", phoneNumber.DeviceId);
                    command.Parameters.AddWithValue("@IsReserved", false);
                    connection.Open();
                    command.ExecuteNonQuery();

                    // Update Device isAssigned property
                    UpdateDeviceIsAssigned(phoneNumber.DeviceId, true);

                    return Ok(phoneNumber);
                }
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        private void UpdateDeviceIsAssigned(int deviceId, bool isAssigned)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("UpdateDeviceIsAssigned", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@DeviceId", deviceId);
                command.Parameters.AddWithValue("@IsAssigned", isAssigned ? 1 : 0);
                connection.Open();
                command.ExecuteNonQuery();
            }
        }
    }
}
