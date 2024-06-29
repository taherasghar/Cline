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
    [RoutePrefix("api/clients")]
    public class ClientController : ApiController
    {
        private readonly string connectionString;

        public ClientController()
        {
            connectionString = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult Add([FromBody] Clients client)
        {
            if (client == null)
            {
                return BadRequest("Invalid client data.");
            }

            // Check if the client name already exists
            if (IsDuplicateClientName(client.Name))
            {
                return BadRequest("Client name already exists.");
            }

            // Calculate the age only if BirthDate is not null
            int? age = null;
            if (client.BirthDate.HasValue)
            {
                age = DateTime.Today.Year - client.BirthDate.Value.Year;
                if (client.BirthDate.Value.Date > DateTime.Today.AddYears(-age.Value)) age--;
            }

            if (client.Type == ClientType.Individual && (!age.HasValue || age < 18))
            {
                return BadRequest("Client must be at least 18 years old.");
            }

            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("AddClient", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@Name", client.Name);
                command.Parameters.AddWithValue("@Type", client.Type);
                command.Parameters.AddWithValue("@BirthDate", client.BirthDate ?? (object)DBNull.Value);
                command.Parameters.AddWithValue("@IsActive", false);

                connection.Open();
                command.ExecuteNonQuery();

                // Retrieve the added client details
               
            }

            return Ok(client);
        }

        [HttpPut]
        [Route("update/{id}")]
        public IHttpActionResult Update([FromUri] int id, [FromBody] Clients client)
        {
            if (client == null || client.Id != id)
            {
                return BadRequest("Invalid client data.");
            }

            // Check if the client name already exists and is not the current client's name
            if (IsDuplicateClientName(client.Name, id))
            {
                return BadRequest("Client name already exists.");
            }

            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("UpdateClient", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@Id", client.Id);
                command.Parameters.AddWithValue("@Name", client.Name);
                command.Parameters.AddWithValue("@Type", client.Type);
                command.Parameters.AddWithValue("@BirthDate", client.BirthDate.HasValue ? (object)client.BirthDate.Value : DBNull.Value);

                try
                {
                    connection.Open();
                    command.ExecuteNonQuery();
                }
                catch (SqlException ex)
                {
                    // Check for custom error message from stored procedure
                    if (ex.Number == 50000 && ex.Class == 16 && ex.State == 1)
                    {
                        return BadRequest(ex.Message); // Return the custom error message
                    }
                    else
                    {
                        throw; // Rethrow the exception for general error handling
                    }
                }

                // Retrieve the updated client details
               
            }

            return Ok(client);
        }

        [HttpGet]
        [Route("getAll")]
        public IHttpActionResult GetAll()
        {
            var clients = new List<Clients>();

            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("GetAllClients", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                connection.Open();
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    clients.Add(ClientMapper.Map(reader));
                }
            }

            if (clients.Count == 0)
            {
                return Ok(clients);
            }
            return Ok(clients.OrderBy(d => d.Id).ToList());
        }

        [HttpGet]
        [Route("getFilteredClients")]
        public IHttpActionResult GetFilteredClients(string searchfilter)
        {
            var clients = new List<Clients>();

            using (var connection = new SqlConnection(connectionString))
            {
                SqlCommand command;

                if (string.IsNullOrWhiteSpace(searchfilter))
                {
                    command = new SqlCommand("GetAllClients", connection)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                }
                else
                {
                    command = new SqlCommand("GetFilteredClients", connection)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    command.Parameters.AddWithValue("@SearchFilter", searchfilter);
                }

                connection.Open();
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    clients.Add(ClientMapper.Map(reader));
                }
            }

            if (clients.Count == 0)
            {
                return Ok(clients);
            }
            return Ok(clients.OrderBy(d => d.Id).ToList());
        }

        private bool IsDuplicateClientName(string clientName, int? clientId = null)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                var command = new SqlCommand("CheckDuplicateClientName", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@Name", clientName);
                if (clientId.HasValue)
                {
                    command.Parameters.AddWithValue("@Id", clientId.Value);
                }

                int duplicateCount = (int)command.ExecuteScalar();

                return duplicateCount > 0;
            }
        }

        // Example method to fetch client by name (replace with your actual implementation)
        private int GetClientIdByName(string clientName)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                var command = new SqlCommand("GetClientIdByName", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@Name", clientName);

                return (int)command.ExecuteScalar();
            }
        }

        // Example method to fetch client by id (replace with your actual implementation)
       
    }
}
