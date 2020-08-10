using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Models;

namespace TvCv19.Frontend.Domain.Repositories
{
    public interface IPhysicianRepository
    {
        Task<Physician> AddPhysicianAsync(Physician physician);
        Task DeletePhysicianAsync(int id);
        Task<IEnumerable<Physician>> GetPhysiciansAsync();
        Task<IEnumerable<Physician>> GetPhysicianTeam(int id);
        Task<Physician> GetPhysicianAsync(int id);
        Task<Physician> GetPhysicianAsync(ApplicationLogin applicationLogin);
        Task<Physician> UpdatePhysicianAsync(Physician physician);
        Task<CarerHierarchyTree> GetHeirarchyTree(int id);
    }

    public class CarerHierarchyTree
    {
        public string Name { get; set; }
        public Hierarchy Hierarchy { get; set; }
        public IEnumerable<CarerHierarchyTree> Children { get; set; }
    }
}
