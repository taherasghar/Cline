using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace vanrise_backend.Models
{
    public class Devices
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool? IsAssigned { get; set; }
    }
}