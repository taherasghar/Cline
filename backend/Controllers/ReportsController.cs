using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using vanrise_backend.Mappers;
using vanrise_backend.Models;

namespace vanrise_backend.Controllers
{
    [RoutePrefix("api/reports")]
    public class ReportsController : ApiController
    {
        private readonly string connectionString;

        public ReportsController()
        {
            connectionString = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
        }

        [HttpGet]
        [Route("getAllClientTypes")]
        public IHttpActionResult GetAll()
        {
            var clientTypes = new List<ClientTypes>();

            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("GetAllClientTypes", connection)
                {
                    CommandType = System.Data.CommandType.StoredProcedure
                };
                connection.Open();
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    clientTypes.Add(ClientTypesMapper.Map(reader));
                }
            }

            if (clientTypes.Count == 0)
            {
                return Ok(clientTypes);
            }
            return Ok(clientTypes.OrderBy(d => d.Id).ToList());
        }

        [HttpGet]
        [Route("getDeviceStatsReport")]
        public IHttpActionResult GetDeviceStatsReport()
        {
            List<DeviceStatsReport> report = new List<DeviceStatsReport>();

            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("GetDeviceStatsReport", connection)
                {
                    CommandType = System.Data.CommandType.StoredProcedure
                };

                connection.Open();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        report.Add(new DeviceStatsReport
                        {
                            DeviceId = reader.GetInt32(0),
                            DeviceName = reader.GetString(1),
                            NumberOfReservedPhoneNumbers = reader.GetInt32(2),
                            NumberOfUnReservedPhoneNumbers = reader.GetInt32(3)
                        });
                    }
                }
            }

            return Ok(report);
        }
    }
}
