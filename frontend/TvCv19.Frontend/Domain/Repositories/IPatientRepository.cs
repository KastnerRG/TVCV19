using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Domain
{
    public interface IPatientRepository
    {
        Task<string> AdmitPatient(Patient patient);
        Task<Patient> GetPatient(string id);
        Task<IEnumerable<Patient>> GetPatients();
        Task<string> DischargePatient(string id);
        Task<IEnumerable<Patient>> GetPatientsByPhysician(string id);
        Task<Patient> UpdatePatient(Patient patientModel);
    }

    public class PocPatientRepository : IPatientRepository
    {
        private static List<Patient> _admittedPatients = new List<Patient>();
        private readonly IPhysicianRepository _physicianRepository;

        public PocPatientRepository(IPhysicianRepository physicianRepository)
        {
            _physicianRepository = physicianRepository;
        }

        public Task<string> AdmitPatient(Patient patient)
        {
            patient.Id = Guid.NewGuid().ToString("N");
            _admittedPatients.Add(patient);

            return Task.FromResult(patient.Id);
        }

        public Task<string> DischargePatient(string id)
        {
            _admittedPatients.Remove(_admittedPatients.FirstOrDefault(x => x.Id == id));
            return Task.FromResult(id);
        }

        public Task<Patient> GetPatient(string id)
        {
            return Task.FromResult(_admittedPatients.FirstOrDefault(x => x.Id == id));
        }

        public Task<IEnumerable<Patient>> GetPatients()
        {
            return Task.FromResult((IEnumerable<Patient>)_admittedPatients);
        }

        public async Task<IEnumerable<Patient>> GetPatientsByPhysician(string id)
        {
            var patients = new List<Patient>();
            var firstLevelTeam = await _physicianRepository.GetPhysicianTeam(id);
            if (firstLevelTeam.Any())
            {
                foreach (var firstLevelTeamMemeber in firstLevelTeam)
                {
                    var secondLevelTeam = await _physicianRepository.GetPhysicianTeam(firstLevelTeamMemeber.Id);
                    if (secondLevelTeam.Any())
                    {
                        foreach (var secondLevelTeamMember in secondLevelTeam)
                        {
                            patients.AddRange(_admittedPatients.Where(x => x.CaregiverId == secondLevelTeamMember.Id));
                        }
                    }
                    patients.AddRange(_admittedPatients.Where(x => x.CaregiverId == firstLevelTeamMemeber.Id));
                }
            }
            patients.AddRange(_admittedPatients.Where(x => x.CaregiverId == id));
            return patients;
        }

        public Task<Patient> UpdatePatient(Patient patientModel)
        {
            return Task.FromResult(_admittedPatients[_admittedPatients.FindIndex(p => p.Id == patientModel.Id)] = patientModel);
        }
    }
}