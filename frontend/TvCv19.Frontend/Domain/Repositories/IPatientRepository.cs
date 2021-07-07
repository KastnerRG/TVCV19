using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TvCv19.Frontend.Domain.Repositories;

namespace TvCv19.Frontend.Domain
{
    public interface IPatientRepository
    {
        Task<int> AdmitPatient(Patient patient);
        Task<Patient> GetPatient(int id);
        Task<IEnumerable<Patient>> GetPatients();
        Task<int> DischargePatient(int id);
        Task<IEnumerable<Patient>> GetPatientsByPhysician(int id);
        Task<Patient> UpdatePatient(Patient patientModel);
    }
}