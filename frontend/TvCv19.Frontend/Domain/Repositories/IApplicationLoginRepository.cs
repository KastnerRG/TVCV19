using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public interface IApplicationLoginRepository
    {
        Task AddApplicationLoginAsync(ApplicationLogin applicationLogin);
        Task DeleteApplicationLoginAsync(string normalizedUserName);
        Task<ApplicationLogin> FindByIdAsync(string id);
        Task<ApplicationLogin> FindByNormalizedUserNameAsync(string normalizedUserName);
        Task UpdateApplicationLoginAsync(ApplicationLogin applicationLogin);
    }
}
