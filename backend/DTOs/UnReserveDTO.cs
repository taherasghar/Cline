using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace vanrise_backend.DTOs
{
    public class UnReserveDTO
    {
        public int ClientId { get; set; }
        public int PhoneNumberId { get; set; }
        public DateTime? EED { get; set; }
    }
}