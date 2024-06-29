using Microsoft.IdentityModel.Tokens;
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Web.Http;
using vanrise_backend.DTOs;
using vanrise_backend.Models;

namespace vanrise_backend.Controllers
{
    [RoutePrefix("api/auth")]
    public class AuthController : ApiController
    {
        private readonly string connectionString;
        private readonly string secretKey;

        public AuthController()
        {
            connectionString = ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
            secretKey = ConfigurationManager.AppSettings["SecretKey"];

            if (string.IsNullOrEmpty(connectionString) || string.IsNullOrEmpty(secretKey))
            {
                throw new Exception("Connection string or Secret Key is not configured correctly.");
            }
        }

        [HttpPost]
        [Route("register")]
        public IHttpActionResult Register([FromBody] RegisterDTO registerDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid registration data.");
            }

            if (string.IsNullOrEmpty(registerDTO.Username) || string.IsNullOrEmpty(registerDTO.Password))
            {
                return BadRequest("Username and password are required.");
            }

            if (SelectFirstExistingUsername(registerDTO.Username))
            {
                return BadRequest("Username already exists.");
            }

            string hashedPassword = HashPassword(registerDTO.Password);

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    var command = new SqlCommand("RegisterUser", connection)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    command.Parameters.AddWithValue("@Username", registerDTO.Username);
                    command.Parameters.AddWithValue("@Password", hashedPassword);
                    command.Parameters.AddWithValue("@FirstName", registerDTO.FirstName);
                    command.Parameters.AddWithValue("@LastName", registerDTO.LastName);

                    connection.Open();
                    int rowsAffected = command.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok("Registration successful.");
                    }
                    else
                    {
                        return InternalServerError(new Exception("Failed to register user."));
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception (ex) here
                return InternalServerError(new Exception("An error occurred while registering the user."));
            }
        }

        [HttpPost]
        [Route("login")]
        public IHttpActionResult Login([FromBody] LoginDTO loginDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid credentials");
            }

            if (string.IsNullOrEmpty(loginDTO.Username) || string.IsNullOrEmpty(loginDTO.Password))
            {
                return BadRequest("Username and password are required.");
            }

            User user = AuthenticateUser(loginDTO.Username, loginDTO.Password);
            if (user == null)
            {
                return BadRequest("Invalid credentails");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secretKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("username", user.Username),
                    new Claim("firstName", user.FirstName),
                    new Claim("lastName", user.LastName)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { Token = tokenString });
        }

        private bool SelectFirstExistingUsername(string username)
        {
            using (var connection = new SqlConnection(connectionString))
            {
                var command = new SqlCommand("SelectFirstExistingUsername", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@Username", username);

                connection.Open();
                var result = command.ExecuteScalar();

                return (result != null && (int)result == 1);
            }
        }

        private User AuthenticateUser(string username, string password)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    var command = new SqlCommand("ValidateUser", connection)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    command.Parameters.AddWithValue("@Username", username);
                    command.Parameters.AddWithValue("@Password", HashPassword(password));

                    connection.Open();
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new User
                            {
                                Username = reader["Username"].ToString(),
                                FirstName = reader["FirstName"].ToString(),
                                LastName = reader["LastName"].ToString()
                            };
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception (ex) here
                throw new Exception("An error occurred while authenticating the user.");
            }

            return null;
        }

        public static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));

                var sb = new StringBuilder();
                foreach (var b in hashedBytes)
                {
                    sb.Append(b.ToString("x2"));
                }
                return sb.ToString();
            }
        }
    }
}
