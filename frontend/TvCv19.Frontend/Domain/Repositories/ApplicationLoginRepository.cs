using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public class ApplicationLoginRepository : BaseRepository, IApplicationLoginRepository
    {
        public Task AddApplicationLoginAsync(ApplicationLogin applicationLogin)
        {
            var id = Guid.NewGuid().ToString().Replace("-", string.Empty);
            var sql = @$"INSERT INTO `medecc`.`application-login`
                        (id, user_name, normalized_user_name, password_hash)
                        VALUES ('{id}', @UserName, @NormalizedUserName, @PasswordHash)";
            return ExecuteAsync<ApplicationLogin>(sql, applicationLogin);
        }

        public async Task DisableApplicationLoginAsync(string normalizedUserName)
        {
            var applicationLogin = await FindByNormalizedUserNameAsync(normalizedUserName);
            applicationLogin.Enabled = false;

            await UpdateApplicationLoginAsync(applicationLogin);
        }

        public Task<ApplicationLogin> FindByIdAsync(string id)
        {
            var sql = "SELECT id, user_name as userName, normalized_user_name as normalizedUserName, password_hash as passwordHash, enabled FROM `medecc`.`application-login` WHERE id = @id";

            return GetFirstOrDefaultAsync<ApplicationLogin>(sql, new { id });
        }

        public Task<ApplicationLogin> FindByNormalizedUserNameAsync(string normalizedUserName)
        {
            var sql = "SELECT id, user_name as userName, normalized_user_name as normalizedUserName, password_hash as passwordHash, enabled FROM `medecc`.`application-login` WHERE normalized_user_name = @normalized_user_name";

            return GetFirstOrDefaultAsync<ApplicationLogin>(sql, new { normalized_user_name = normalizedUserName });
        }

        public async Task<ApplicationLogin> UpdateApplicationLoginAsync(ApplicationLogin applicationLogin)
        {
            var sql = @$"UPDATE medecc.application-login
                         SET user_name = @UserName, normalized_user_name = @NormalizedUserName, password_hash = @PasswordHash, enabled = @Enabled
                         WHERE  id = @Id";
            await ExecuteAsync<ApplicationLogin>(sql, applicationLogin);
            return applicationLogin;
        }
    }
}
