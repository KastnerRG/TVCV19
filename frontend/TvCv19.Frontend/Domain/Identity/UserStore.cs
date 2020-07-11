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
    public class UserStore : IUserStore<ApplicationLogin>, IUserPasswordStore<ApplicationLogin>
    {
        private readonly IApplicationLoginRepository _repository;

        public UserStore(IApplicationLoginRepository repository)
        {
            _repository = repository;
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
            if (applicationLogin.Enabled)
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
            if (applicationLogin.Enabled)
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

        public Task<bool> HasPasswordAsync(ApplicationLogin user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            return Task.FromResult(!string.IsNullOrEmpty(user.PasswordHash));
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
