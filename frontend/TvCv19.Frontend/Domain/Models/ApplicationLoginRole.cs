using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain.Models
{
    public class ApplicationLoginRole : IDbEntity
    {
        public int Id { get; set; }

        [Required]
        public int ApplicationLoginId { get; set; }
        public ApplicationLogin ApplicationLogin { get; set; }

        [Required]
        public int ApplicationRoleId { get; set; }
        public ApplicationRole ApplicationRole { get; set; }
    }
}
