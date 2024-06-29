using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Services.Description;
using vanrise_backend.Models;

namespace vanrise_backend.Mappers
{
    public static class DeviceMapper
    {
        public static Devices Map(SqlDataReader reader)
        {
            return new Devices
            {
                Id = (int)reader["Id"],
                Name = (string)reader["Name"],
                IsAssigned = (bool)reader["IsAssigned"]
            };
        }
    }
}