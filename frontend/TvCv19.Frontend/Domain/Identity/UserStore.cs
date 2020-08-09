using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Domain.Identity
{
    public class UserStore : IUserStore<ApplicationLogin>, IUserPasswordStore<ApplicationLogin>, IUserRoleStore<ApplicationLogin>
    {
        private readonly IApplicationLoginRepository _repository;
        private readonly RoleManager<ApplicationRole> _roleManager;

        public UserStore(IApplicationLoginRepository repository, RoleManager<ApplicationRole> roleManager)
        {
            _repository = repository;
            _roleManager = roleManager;
        }

        public async Task AddToRoleAsync(ApplicationLogin user, string roleName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var role = await _roleManager.FindByNameAsync(roleName);

            if (role == null)
            {
                throw new ArgumentNullException($"{nameof(roleName)} is null");
            }

            user.Roles.Add(role);
        }

        public async Task<IdentityResult> CreateAsync(ApplicationLogin user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            await _repository.AddApplicationLoginAsync(user);

            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(ApplicationLogin user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            await _repository.DisableApplicationLoginAsync(user.NormalizedUserName);

            return IdentityResult.Success;
        }

        public void Dispose()
        {
        }

        public async Task<ApplicationLogin> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var applicationLogin = await _repository.FindByIdAsync(userId);
            if (applicationLogin?.Enabled ?? false)
            {
                return applicationLogin;
            }
            else
            {
                return null;
            }
        }

        public async Task<ApplicationLogin> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var applicationLogin = await _repository.FindByNormalizedUserNameAsync(normalizedUserName);
            if (applicationLogin?.Enabled ?? false)
            {
                return applicationLogin;
            }
            else
            {
                return null;
            }    
        }

        public Task<string> GetNormalizedUserNameAsync(ApplicationLogin user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            return Task.FromResult(user.NormalizedUserName);
        }

        public Task<string> GetPasswordHashAsync(ApplicationLogin user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            return Task.FromResult(user.PasswordHash);
        }

        public Task<IList<string>> GetRolesAsync(ApplicationLogin user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            return Task.FromResult((IList<string>)(from r in user.Roles
                                                   select r.Name).ToList());
        }

        public Task<string> GetUserIdAsync(ApplicationLogin user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            return Task.FromResult(user.Id);
        }

        public Task<string> GetUserNameAsync(ApplicationLogin user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            return Task.FromResult(user.UserName);
        }

        public async Task<IList<ApplicationLogin>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var role = await _roleManager.FindByNameAsync(roleName);

            if (role == null)
            {
                return null;
            }

            return (from u in await _repository.GetApplicationLoginsAsync()
                    where u.Roles.Any(r => r.NormalizedName == role.NormalizedName)
                    select u).ToList();
        }

        public Task<bool> HasPasswordAsync(ApplicationLogin user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            return Task.FromResult(!string.IsNullOrEmpty(user.PasswordHash));
        }

        public async Task<bool> IsInRoleAsync(ApplicationLogin user, string roleName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var role = await _roleManager.FindByNameAsync(roleName);
            return (from r in user.Roles
                    where r.NormalizedName == role?.NormalizedName
                    select r).Any();
        }

        public async Task RemoveFromRoleAsync(ApplicationLogin user, string roleName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var role = await _roleManager.FindByNameAsync(roleName);
            var userRole = (from r in user.Roles
                            where r.NormalizedName == role?.NormalizedName
                            select r).FirstOrDefault();

            if (userRole != null)
            {
                user.Roles.Remove(userRole);
            }
        }

        public Task SetNormalizedUserNameAsync(ApplicationLogin user, string normalizedName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            user.NormalizedUserName = normalizedName;

            return Task.FromResult(0);
        }

        public Task SetPasswordHashAsync(ApplicationLogin user, string passwordHash, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            user.PasswordHash = passwordHash;

            return Task.FromResult(0);
        }

        public Task SetUserNameAsync(ApplicationLogin user, string userName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            user.UserName = userName;

            return Task.FromResult(0);
        }

        public async Task<IdentityResult> UpdateAsync(ApplicationLogin user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            await _repository.UpdateApplicationLoginAsync(user);

            return IdentityResult.Success;
        }
    }
}
