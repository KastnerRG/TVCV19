using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public class ApplicationRoleRepository : IApplicationRoleRepository
    {
        public async Task AddApplicationRoleAsync(ApplicationRole applicationRole)
        {
            using var context = new MedeccContext();

            await context.ApplicationRoles.AddAsync(applicationRole);
            await context.SaveChangesAsync();
        }

        public Task DeleteApplicationRoleAsync(ApplicationRole applicationRole)
        {
            using var context = new MedeccContext();

            context.Remove(applicationRole);
            return context.SaveChangesAsync();
        }

        public Task<ApplicationRole> FindByIdAsync(int id)
        {
            using var context = new MedeccContext();

            var applicationRole = (from r in context.ApplicationRoles
                                   where r.Id == id
                                   select r)
                                   .Include(p => p.LoginRoles)
                                   .ThenInclude(p => p.ApplicationLogin)
                                   .FirstOrDefault();

            return Task.FromResult(applicationRole);
        }

        public Task<ApplicationRole> FindByNameAsync(string normalizedRoleName)
        {
            using var context = new MedeccContext();

            var applicationRole = (from r in context.ApplicationRoles
                                   where r.NormalizedName == normalizedRoleName
                                   select r)
                                   .Include(p => p.LoginRoles)
                                   .ThenInclude(p => p.ApplicationLogin)
                                   .FirstOrDefault();

            return Task.FromResult(applicationRole);
        }

        public async Task<ApplicationRole> UpdateAsync(ApplicationRole role)
        {
            using var context = new MedeccContext();

            var @return = context.Update(role);
            await context.SaveChangesAsync();

            return @return.Entity;
        }
    }
}
