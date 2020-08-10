using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain
{
    public class Physician : IDbEntity
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Location { get; set; }
        [Required]
        public Hierarchy Hierarchy { get; set; }
        public int? SupervisorId { get; set; }
        [Required]
        public int ApplicationLoginId { get; set; }
        public ApplicationLogin ApplicationLogin { get; set; }
    }
    public enum Hierarchy { FirstLine = 1, SecondLine = 2, Commander = 3 }
}
