using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain
{
    public class PhysicianRepository
    {
        private static List<Physician> physicians = new List<Physician>();

        public Task<string> AddPhysician(Physician physician)
        {
            physicians.Add(physician);

            return Task.FromResult(physician.Id);
        }
    }
}
