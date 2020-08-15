using System.ComponentModel.DataAnnotations;

namespace TvCv19.Frontend.Domain.Models
{
    public class PatientRegistration
    {

        public int Id { get; set; }
        public int ApplicationLoginId { get; set; }
        [Required]
        public string Username { get; set; }
        
        [Required]
        public string Password { get; set; }
       
        [Required]
        public string Name { get; set; }
        
        [Required]
        public string Location { get; set; }

    }

}
