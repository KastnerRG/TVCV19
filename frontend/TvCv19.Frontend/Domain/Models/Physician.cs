﻿using System.ComponentModel.DataAnnotations;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain
{
    public class Physician : IDbEntity
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public Hierarchy Hierarchy { get; set; }
        public string SupervisorId { get; set; }
        public string Username { get; set; }
    }

    public class PhysicianRegistration: Physician {
        public string Password { get; set; }
    }
    public enum Hierarchy { FirstLine = 1, SecondLine = 2, Commander = 3 }
}
