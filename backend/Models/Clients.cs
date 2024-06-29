using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace vanrise_backend.Models
{
    public enum ClientType
    {
        Individual = 1,
        Organization = 2
    }
    public class Clients
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ClientType Type { get; set; }
        public DateTime? BirthDate { get; set; }
        public bool? IsActive { get; set; }
    }
}