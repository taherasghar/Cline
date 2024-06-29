using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using vanrise_backend.Models;

namespace vanrise_backend.Mappers
{
    public class PhoneNumberMapper
    {
        public static PhoneNumbers Map(SqlDataReader reader)
        {
            return new PhoneNumbers
            {
                Id = (int)reader["Id"],
                Number = (string)reader["Number"],
                DeviceId = (int)reader["DeviceId"],
                IsReserved = (bool)reader["IsReserved"]
            };
        }
    }
}