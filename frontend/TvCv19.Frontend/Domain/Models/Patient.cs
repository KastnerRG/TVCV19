using System;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain
{
    public class Patient : IDbEntity
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string CaregiverId { get; set; }
        public string Location { get; set; }
        public int EscalationLevel { get; set; }
        public AdmissionStatus AdmissionStatus { get; set; }
        public string Token { get; set; }
        public Gender Gender { get; set; }
        public string Height { get; set; }
        public string DateOfBirth { get; set; }
    }

    public enum AdmissionStatus { Admitted = 1, Discharged = 2 }

    public enum Gender { Male = 1, Female = 2}

}
