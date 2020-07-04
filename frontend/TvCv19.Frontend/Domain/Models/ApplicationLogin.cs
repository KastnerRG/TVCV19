using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain.Models
{
    public class ApplicationLogin : IDbEntity
    {
        public string Id { get; set; }
        public string NormalizedUserName { get; set; }
        public string UserName { get; set; }
    }
}
