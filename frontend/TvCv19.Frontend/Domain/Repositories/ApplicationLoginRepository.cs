using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public class ApplicationLoginRepository : IApplicationLoginRepository
    {
        public Task AddApplicationLoginAsync(ApplicationLogin applicationLogin)
        {
            throw new NotImplementedException();
        }

        public Task DeleteApplicationLoginAsync(string normalizedUserName)
        {
            throw new NotImplementedException();
        }

        public Task<ApplicationLogin> FindByIdAsync(string id)
        {
            throw new NotImplementedException();
        }

        public Task<ApplicationLogin> FindByNormalizedUserNameAsync(string normalizedUserName)
        {
            throw new NotImplementedException();
        }

        public Task UpdateApplicationLoginAsync(ApplicationLogin applicationLogin)
        {
            throw new NotImplementedException();
        }
    }
}
