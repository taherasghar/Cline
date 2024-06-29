using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace vanrise_backend.DTOs
{
    public class RegisterDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}