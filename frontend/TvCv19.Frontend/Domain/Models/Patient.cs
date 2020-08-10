using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain
{
    public class Patient : IDbEntity
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public int CaregiverId { get; set; }
        [Required]
        public string Location { get; set; }
        public int EscalationLevel { get; set; }
        [Required]
        public AdmissionStatus AdmissionStatus { get; set; }
        public string Token { get; set; }
    }
 
    public enum AdmissionStatus{ Admitted = 1, Discharged = 2 }
}
