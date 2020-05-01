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
        Task<Physician> GetPhysicianAsync(string id);
        Task UpdatePhysicianAsync(Physician physician);
    }

    public class PocPhyscianRepository : IPhysicianRepository
    {
        private static HashSet<Physician> _physicians = new HashSet<Physician>();
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

        public Task<IEnumerable<Physician>> GetPhysiciansAsync() => Task.FromResult((IEnumerable<Physician>)_physicians);

        public Task<Physician> GetPhysicianAsync(string id) => Task.FromResult(_physicians.FirstOrDefault(x => x.Id == id));

        public async Task UpdatePhysicianAsync(Physician physician)
        {
            await DeletePhysicianAsync(physician.Id);
            await AddPhysicianAsync(physician);
        }
    }
}
