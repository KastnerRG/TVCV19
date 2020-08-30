using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public async Task AddClaims(User user, IEnumerable<Claim> claims)
        {
            foreach (var claim in claims)
            {
                var sql = @$"INSERT INTO medecc.userclaims
                                (`UserId`,`ClaimType`,`ClaimValue`)
                                VALUES('{user.Id}',@Type,@Value);";

                await ExecuteAsync<UserClaim>(sql, claim);
            }
        }

        public Task AddUserAsync(User user)
        {
            var sql = @$"INSERT INTO medecc.users
                        (id, user_name, normalized_user_name, password_hash)
                        VALUES (@Id, @UserName, @NormalizedUserName, @PasswordHash)";
            return ExecuteAsync<User>(sql, user);
        }

        public async Task DisableUserAsync(string normalizedUserName)
        {
            var applicationLogin = await FindByNormalizedUserNameAsync(normalizedUserName);
            applicationLogin.Enabled = false;

            await UpdateApplicationLoginAsync(applicationLogin);
        }

        public Task<User> FindByIdAsync(string id)
        {
            var sql = "SELECT id, user_name as userName, normalized_user_name as normalizedUserName, password_hash as passwordHash, enabled FROM `medecc`.`users` WHERE id = @id";

            return GetFirstOrDefaultAsync<User>(sql, new { id });
        }

        public Task<User> FindByNormalizedUserNameAsync(string normalizedUserName)
        {
            var sql = "SELECT id, user_name as userName, normalized_user_name as normalizedUserName, password_hash as passwordHash, enabled FROM `medecc`.`users` WHERE normalized_user_name = @normalized_user_name";

            return GetFirstOrDefaultAsync<User>(sql, new { normalized_user_name = normalizedUserName });
        }

        public Task<IEnumerable<User>> GetApplicationLoginsAsync()
        {
            var sql = "SELECT id, user_name as userName, normalized_user_name as normalizedUserName, password_hash as passwordHash, enabled FROM `medecc`.`users`";

            return GetAsync<User>(sql, null);
        }

        public async Task<IList<Claim>> GetClaimsAsync(string id)
        {
            var claims = new List<Claim>();
            var sql = "SELECT * from medecc.userclaims Where UserId = @id";
            var userClaims = await GetAsync<UserClaim>(sql, new { id });
            foreach (var claim in userClaims)
            {
                claims.Add(new Claim(claim.ClaimType, claim.ClaimValue));
            }
            return claims;
        }

        public async Task<User> UpdateApplicationLoginAsync(User applicationLogin)
        {
            var sql = @$"UPDATE `users`
                         SET user_name = @UserName, normalized_user_name = @NormalizedUserName, password_hash = @PasswordHash, enabled = @Enabled
                         WHERE  id = @Id";
            await ExecuteAsync<User>(sql, applicationLogin);
            return applicationLogin;
        }
    }
}
