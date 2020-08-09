using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public interface IApplicationRoleRepository
    {
        Task AddApplicationRoleAsync(ApplicationRole applicationRole);
        Task DeleteApplicationRoleAsync(ApplicationRole applicationRole);
        Task<ApplicationRole> FindByIdAsync(string id);
        Task<ApplicationRole> FindByNameAsync(string normalizedRoleName);
        Task<ApplicationRole> UpdateAsync(ApplicationRole role);
    }
}
