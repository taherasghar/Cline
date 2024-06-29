using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Http;
using vanrise_backend.Mappers;

namespace vanrise_backend.Models
{
    public class PhoneNumbers
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public int DeviceId { get; set; }
        public bool IsReserved { get; set; }

    }
}