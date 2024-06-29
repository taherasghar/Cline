using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace vanrise_backend.Models
{
    public class DeviceStatsReport
    {
        public int DeviceId { get; set; }
        public string DeviceName { get; set; }
        public int NumberOfReservedPhoneNumbers { get; set; }
        public int NumberOfUnReservedPhoneNumbers { get; set; }
    }
}