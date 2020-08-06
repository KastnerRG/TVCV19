using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Domain
{


    public class PatientRepository : IPatientRepository
    {
        public async Task<string> AdmitPatient(Patient patient)
        {
            using var context = new MedeccContext();

            patient.Id = Guid.NewGuid().ToString().Replace("-", string.Empty);

            await context.AddAsync(patient);
            await context.SaveChangesAsync();

            return patient.Id;
        }

        public async Task<string> DischargePatient(string id)
        {
            using var context = new MedeccContext();

            var patient = (from p in context.Patients
                           where p.Id == id
                           select p).First();

            patient.AdmissionStatus = AdmissionStatus.Discharged;
            await context.SaveChangesAsync();

            return id;
        }

        public Task<Patient> GetPatient(string id)
        {
            using var context = new MedeccContext();

            return Task.FromResult((from p in context.Patients
                                    where p.Id == id && p.AdmissionStatus == AdmissionStatus.Admitted
                                    select p).FirstOrDefault());
        }

        public Task<IEnumerable<Patient>> GetPatients()
        {
            using var context = new MedeccContext();

            var patients = from p in context.Patients
                           where p.AdmissionStatus == AdmissionStatus.Admitted
                           select p;

            return Task.FromResult((IEnumerable<Patient>)patients.ToArray());
        }

        public Task<IEnumerable<Patient>> GetPatientsByPhysician(string id)
        {
            using var context = new MedeccContext();

            var firstLevelTeam = (from c in context.Caregivers
                                  where c.SupervisorId == id
                                  select c.Id).ToHashSet();

            var secondLevelTeam = from c in context.Caregivers
                                  where firstLevelTeam.Contains(c.SupervisorId)
                                  select c.Id;

            var caregivers = firstLevelTeam.Concat(secondLevelTeam).ToHashSet();

            var patients = from p in context.Patients
                           where (caregivers.Contains(p.CaregiverId) || p.CaregiverId == id) &&
                            p.AdmissionStatus == AdmissionStatus.Admitted
                           select p;

            return Task.FromResult((IEnumerable<Patient>)patients.ToArray());
        }

        public async Task<Patient> UpdatePatient(Patient patient)
        {
            using var context = new MedeccContext();

            context.Update(patient);
            await context.SaveChangesAsync();

            return patient;
        }
    }
}