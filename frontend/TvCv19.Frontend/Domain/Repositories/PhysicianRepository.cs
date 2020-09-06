using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using MySql.Data.MySqlClient;

namespace TvCv19.Frontend.Domain.Repositories
{


    public class PhyscianRepository : BaseRepository, IPhysicianRepository
    {
        public async Task<Physician> AddPhysicianAsync(Physician physician)
        {
            var sql = @$"INSERT INTO medecc.caregiver
                        (id, name, location, hierarchy, supervisor_id)
                         VALUES (@Id, @Name, @Location, @Hierarchy, @SupervisorId)";

            await ExecuteAsync<Physician>(sql, physician);
            return physician;
        }

        public async Task DeletePhysicianAsync(string id)
        {
            var sql = "DELETE FROM medecc.caregiver WHERE id = @id";
            var param = new { id };
            await ExecuteAsync<Physician>(sql, param);
        }
        public async Task<IEnumerable<Physician>> GetPhysicianTeam(string id)
        {
            var sql = "SELECT * FROM medecc.caregiver WHERE supervisor_id = @id";
            var param = new { id };
            return await GetAsync<Physician>(sql, param);
        }

        public async Task<IEnumerable<Physician>> GetPhysiciansAsync()
        {
            var sql = @"SELECT caregiver.id, name, location, hierarchy, supervisor_id as supervisorId, user_name as username FROM medecc.caregiver as caregiver
                        LEFT JOIN medecc.users as users ON users.id = caregiver.id";
            return await GetAsync<Physician>(sql, new { });
        }

        public async Task<Physician> GetPhysicianAsync(string id)
        {
            var param = new { id };
            var sql = @"SELECT caregiver.id, name, location, hierarchy, supervisor_id as supervisorId, user_name as username 
                        FROM medecc.caregiver as caregiver 
                        LEFT JOIN medecc.users as users ON users.id = caregiver.id
                        WHERE caregiver.id = @id";
            return await GetFirstOrDefaultAsync<Physician>(sql, param);
        }

        public async Task<Physician> UpdatePhysicianAsync(Physician physician)
        {

            var sql = @$"UPDATE medecc.caregiver
                         SET name = @Name, location = @Location, hierarchy = @Hierarchy, supervisor_id = @SupervisorId
                         WHERE id = @Id";

            await ExecuteAsync<Physician>(sql, physician);
            return physician;
        }

        public async Task<CarerHierarchyTree> GetHeirarchyTree(string id)
        {
            var directReports = await GetPhysicianTeam(id);
            if (!directReports.Any())
            {
                var supervisorId = (await GetPhysicianAsync(id)).SupervisorId;
                var supervisor = (await GetPhysiciansAsync()).Where(p => p.Id == supervisorId).FirstOrDefault();
                return new CarerHierarchyTree()
                {
                    Name = "Supervisor",
                    Children = new[] {new CarerHierarchyTree() {
                        Name = supervisor.Name
                    }}
                };
            }
            var tree = new CarerHierarchyTree()
            {
                Name = "Care Team"
            };
            var children = (await Task.WhenAll(directReports.Select(async r => new CarerHierarchyTree()
            {
                Name = r.Name,
                Hierarchy = r.Hierarchy,
                Children = (await GetPhysicianTeam(r.Id)).Select(bc => new CarerHierarchyTree()
                {
                    Name = bc.Name,
                    Hierarchy = bc.Hierarchy
                })
            })));
            tree.Children = children;
            return tree;
        }
    }
}

