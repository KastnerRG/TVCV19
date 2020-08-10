using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain.Models
{
    public class ApplicationRole : IDbEntity
    {
        public int Id { get; set; }
        public IList<ApplicationLoginRole> LoginRoles { get; set; }
        [Required]
        public string Name { get; set; }
        public string NormalizedName { get; set; }
    }
}
