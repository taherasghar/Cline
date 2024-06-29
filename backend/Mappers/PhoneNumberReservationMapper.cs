using System;
using System.Data.SqlClient;
using vanrise_backend.Models;

namespace vanrise_backend.Mappers
{
    public static class PhoneNumberReservationMapper
    {
        public static PhoneNumbersReservations Map(SqlDataReader reader)
        {
            return new PhoneNumbersReservations
            {
                Id = (int)reader["Id"],
                ClientId = (int)reader["ClientId"],
                ClientName = reader["ClientName"].ToString(), // Map ClientName
                PhoneNumberId = (int)reader["PhoneNumberId"],
                PhoneNumber = reader["PhoneNumber"].ToString(), // Map PhoneNumber
                BED = (DateTime)reader["BED"],
                EED = reader["EED"] == DBNull.Value ? (DateTime?)null : (DateTime)reader["EED"]
            };
        }
    }
}
