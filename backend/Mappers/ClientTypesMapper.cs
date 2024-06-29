using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using vanrise_backend.Models;

namespace vanrise_backend.Mappers
{
    public static class ClientTypesMapper
    {
        public static ClientTypes Map(SqlDataReader reader)
        {
            return new ClientTypes
            {
                Id = (int)reader["Id"],
                Name = reader["Name"].ToString(),
                Count = (int)reader["Count"],
              
            };
        }
    }
}
