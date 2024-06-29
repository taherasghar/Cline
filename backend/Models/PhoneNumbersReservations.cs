using System;

namespace vanrise_backend.Models
{
    public class PhoneNumbersReservations
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public string ClientName { get; set; } // Add ClientName
        public int PhoneNumberId { get; set; }
        public string PhoneNumber { get; set; } // Add PhoneNumber
        public DateTime BED { get; set; }
        public DateTime? EED { get; set; }
    }
}
