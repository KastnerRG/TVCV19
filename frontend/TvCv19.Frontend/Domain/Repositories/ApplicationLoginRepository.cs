using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public class ApplicationLoginRepository : IApplicationLoginRepository
    {
        public async Task AddApplicationLoginAsync(ApplicationLogin applicationLogin)
        {
            applicationLogin.Id = Guid.NewGuid().ToString("N");

            using var context = new MedeccContext();
            await context.AddAsync(applicationLogin);

            await context.SaveChangesAsync();
        }

        public async Task DisableApplicationLoginAsync(string normalizedUserName)
        {
            var applicationLogin = await FindByNormalizedUserNameAsync(normalizedUserName);
            applicationLogin.Enabled = false;

            await UpdateApplicationLoginAsync(applicationLogin);
        }

        public Task<ApplicationLogin> FindByIdAsync(string id)
        {
            using var context = new MedeccContext();

            return Task.FromResult((from a in context.ApplicationLogins
                                    where a.Id == id
                                    select a).Include(l => l.LoginRoles).FirstOrDefault());
        }

        public Task<ApplicationLogin> FindByNormalizedUserNameAsync(string normalizedUserName)
        {
            using var context = new MedeccContext();

            return Task.FromResult((from a in context.ApplicationLogins
                                    where a.NormalizedUserName == normalizedUserName
                                    select a).Include(l => l.LoginRoles).FirstOrDefault());
        }

        public Task<IEnumerable<ApplicationLogin>> GetApplicationLoginsAsync()
        {
            using var context = new MedeccContext();

            return Task.FromResult((IEnumerable<ApplicationLogin>)context.ApplicationLogins.Include(l => l.LoginRoles).ToArray());
        }

        public async Task<ApplicationLogin> UpdateApplicationLoginAsync(ApplicationLogin applicationLogin)
        {
            using var context = new MedeccContext();

            var @return = context.Update(applicationLogin);
            await context.SaveChangesAsync();

            return @return.Entity;
        }
    }
}
