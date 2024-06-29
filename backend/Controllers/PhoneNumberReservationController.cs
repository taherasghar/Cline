using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Http;
using vanrise_backend.DTOs;
using vanrise_backend.Mappers;
using vanrise_backend.Models;

namespace vanrise_backend.Controllers
{
    [RoutePrefix("api/phoneNumbersReservations")]
    public class PhoneNumberReservationController : ApiController
    {
        private readonly string connectionString;

        public PhoneNumberReservationController()
        {
            connectionString = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
        }



        [HttpPost]
        [Route("reserve")]
        public IHttpActionResult ReservePhoneNumber(PhoneNumbersReservations reservation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("AddReservedPhoneNumber", connection)
                {
                    CommandType = System.Data.CommandType.StoredProcedure
                };

                DateTime now = DateTime.UtcNow;
                DateTime bed = now.AddHours(3);
                command.Parameters.AddWithValue("@ClientId", reservation.ClientId);
                command.Parameters.AddWithValue("@PhoneNumberId", reservation.PhoneNumberId);
                command.Parameters.AddWithValue("@BED", bed);
                command.Parameters.AddWithValue("@EED", DBNull.Value);

                connection.Open();
                var id = command.ExecuteScalar();
                reservation.Id = Convert.ToInt32(id);
            }

            return Ok(reservation);
        }

       

        [HttpPut]
        [Route("unReserve")]
        public IHttpActionResult UnReservePhoneNumber(UnReserveDTO unReserveDTO)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("UpdateToUnReservePhoneNumber", connection)
                {
                    CommandType = System.Data.CommandType.StoredProcedure
                };
                DateTime now = DateTime.UtcNow;
                DateTime eed = now.AddHours(3);
                command.Parameters.AddWithValue("@ClientId", unReserveDTO.ClientId);
                command.Parameters.AddWithValue("@PhoneNumberID", unReserveDTO.PhoneNumberId);
                command.Parameters.AddWithValue("@EED", eed);

                connection.Open();
                command.ExecuteNonQuery();
            }

            return Ok();
        }

        [HttpGet]
        [Route("getReservedPhoneNumbers")]
        public IHttpActionResult GetReservedPhoneNumbers(int clientId)
        {
            try
            {
                List<PhoneNumberDTO> phoneNumbers = new List<PhoneNumberDTO>();

                using (var connection = new SqlConnection(connectionString))
                {
                    using (var command = new SqlCommand("GetReservedPhoneNumbersByClient", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ClientId", clientId);

                        connection.Open();
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                phoneNumbers.Add(new PhoneNumberDTO
                                {
                                    PhoneNumberId = reader.GetInt32(0),
                                    Number = reader.GetString(1)
                                });
                            }
                        }
                    }
                }

                return Ok(phoneNumbers);
            }
            catch (Exception ex)
            {
                // Log the exception (optional)
                return InternalServerError(ex);
            }
        }
    



      
    [HttpGet]
        [Route("getAll")]
        public IHttpActionResult GetAllReservedPhoneNumbers()
        {
            var reservations = new List<PhoneNumbersReservations>();

            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("GetAllReservedPhoneNumbers", connection)
                {
                    CommandType = System.Data.CommandType.StoredProcedure
                };

                connection.Open();
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    reservations.Add(PhoneNumberReservationMapper.Map(reader));
                }
            }

            return Ok(reservations.OrderBy(r => r.Id).ToList());
        }


        [HttpDelete]
        [Route("delete/{id:int}")]
        public IHttpActionResult DeleteReservation(int id)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("DeleteReservation", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@Id", id);

                connection.Open();
                command.ExecuteNonQuery();
            }

            return Ok();
        }
    }
}
