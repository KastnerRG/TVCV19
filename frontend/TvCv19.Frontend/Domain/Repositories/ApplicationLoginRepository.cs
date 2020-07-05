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
            return ExecuteAsync<Patient>(sql, applicationLogin);
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
            var sql = "SELECT id, user_name, normalized_user_name, password_hash FROM `medecc`.`application-login` WHERE normalized_user_name = @normalized_user_name";

            return GetFirstOrDefaultAsync<ApplicationLogin>(sql, new { normalized_user_name = normalizedUserName });
        }

        public Task UpdateApplicationLoginAsync(ApplicationLogin applicationLogin)
        {
            throw new NotImplementedException();
        }
    }
}
