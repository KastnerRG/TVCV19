﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace TvCv19.Frontend.Domain.Repositories
{
    public interface IPhysicianRepository
    {
        Task<Physician> AddPhysicianAsync(Physician physician);
        Task DeletePhysicianAsync(string id);
        Task<IEnumerable<Physician>> GetPhysiciansAsync();
        Task<IEnumerable<Physician>> GetPhysicianTeam(string id);
        Task<Physician> GetPhysicianAsync(string id);
        Task<Physician> UpdatePhysicianAsync(Physician physician);
    }

    public class PocPhyscianRepository : IPhysicianRepository
    {
        private static List<Physician> _physicians = new List<Physician>();
        private static int count;

        public Task<Physician> AddPhysicianAsync(Physician physician)
        {
            count++;
            physician.Id = $"{count}";
            _physicians.Add(physician);
            return Task.FromResult(physician);
        }

        public async Task DeletePhysicianAsync(string id)
        {
            var physicianToDelete = await GetPhysicianAsync(id);
            _physicians.Remove(physicianToDelete);
        }
        public async Task<IEnumerable<Physician>> GetPhysicianTeam(string id) => (await GetPhysiciansAsync()).Where(p => p.SupervisorId == id);

        public Task<IEnumerable<Physician>> GetPhysiciansAsync() => Task.FromResult((IEnumerable<Physician>)_physicians);

        public Task<Physician> GetPhysicianAsync(string id) => Task.FromResult(_physicians.FirstOrDefault(x => x.Id == id));

        public Task<Physician> UpdatePhysicianAsync(Physician physician)
        {
            return Task.FromResult(_physicians[_physicians.FindIndex(p => p.Id == physician.Id)] = physician);
        }
    }
}
