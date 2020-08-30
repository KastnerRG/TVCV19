using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public interface IUserRepository
    {
        Task AddUserAsync(User applicationLogin);
        Task DisableUserAsync(string normalizedUserName);
        Task<User> FindByIdAsync(string id);
        Task<User> FindByNormalizedUserNameAsync(string normalizedUserName);
        Task<IEnumerable<User>> GetApplicationLoginsAsync();
        Task<User> UpdateApplicationLoginAsync(User applicationLogin);
        Task AddClaims(User user, IEnumerable<Claim> claims);
        Task<IList<Claim>> GetClaimsAsync(string id);
    }
}
