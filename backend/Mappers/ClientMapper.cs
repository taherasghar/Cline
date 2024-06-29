using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using vanrise_backend.Models;

namespace vanrise_backend.Mappers
{
    public static class ClientMapper
    {
        public static Clients Map(SqlDataReader reader)
        {
            return new Clients
            {
                Id = (int)reader["Id"],
                Name = reader["Name"].ToString(),
                Type = (ClientType)reader["Type"],
                BirthDate = reader["BirthDate"] == DBNull.Value ? (DateTime?)null : (DateTime)reader["BirthDate"],
                IsActive = (bool)reader["IsActive"],
            };
        }
    }
}
