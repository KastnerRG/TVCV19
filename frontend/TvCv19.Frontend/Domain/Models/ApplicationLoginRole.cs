using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain.Models
{
    public class ApplicationLoginRole
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string Id { get; set; }

        [Required]
        public string ApplicationLoginId { get; set; }
        public ApplicationLogin ApplicationLogin { get; set; }

        [Required]
        public string ApplicationRoleId { get; set; }
        public ApplicationRole ApplicationRole { get; set; }
    }
}
