using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

namespace TvCv19.Frontend.Domain.Repositories
{


    public class PhyscianRepository : IPhysicianRepository
    {
        public async Task<Physician> AddPhysicianAsync(Physician physician)
        {
            using var context = new MedeccContext();

            physician.Id = Guid.NewGuid().ToString().Replace("-", string.Empty);

            await context.AddAsync(physician);
            await context.SaveChangesAsync();

            return physician;
        }

        public async Task DeletePhysicianAsync(string id)
        {
            using var context = new MedeccContext();

            context.Remove(await GetPhysicianAsync(id));
            await context.SaveChangesAsync();
        }

        public Task<IEnumerable<Physician>> GetPhysicianTeam(string id)
        {
            using var context = new MedeccContext();

            var caregiverTeam = from c in context.Caregivers
                                where c.SupervisorId == id
                                select c;

            return Task.FromResult((IEnumerable<Physician>)caregiverTeam.ToArray());
        }

        public Task<IEnumerable<Physician>> GetPhysiciansAsync()
        {
            using var context = new MedeccContext();

            return Task.FromResult((IEnumerable<Physician>)context.Caregivers.ToArray());
        }

        public Task<Physician> GetPhysicianAsync(string id)
        {
            using var context = new MedeccContext();

            return Task.FromResult((from c in context.Caregivers
                                    where c.Id == id
                                    select c).FirstOrDefault());
        }

        public async Task<Physician> UpdatePhysicianAsync(Physician physician)
        {
            using var context = new MedeccContext();

            context.Update(physician);
            await context.SaveChangesAsync();

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

