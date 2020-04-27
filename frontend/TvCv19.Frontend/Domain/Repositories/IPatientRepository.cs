using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain
{
    public interface IPatientRepository
    {
        Task<string> AdmitPatient(Patient patient);
        Task<Patient> GetPatient(string id);
        Task<IEnumerable<Patient>> GetPatients();
        string DischargePatient(string id);
        Task<IEnumerable<Patient>> GetPatientsByPhysician(string id);
        Task<Patient> UpdatePatient(Patient patientModel);
    }

    public class PocPatientRepository : IPatientRepository
    {
        private static List<Patient> _admittedPatients = new List<Patient>();
        private static int _count;


        public Task<string> AdmitPatient(Patient patient)
        {
            _count++;
            patient.Id = $"{_count}";
            _admittedPatients.Add(patient);
            
            return Task.FromResult(patient.Id);
        }

        public string DischargePatient(string id)
        {
            _admittedPatients.Remove(_admittedPatients.FirstOrDefault(x => x.Id == id));
            return id;
        }

        public Task<Patient> GetPatient(string id)
        {
            return Task.FromResult(_admittedPatients.FirstOrDefault(x => x.Id == id));
        }

        public Task<IEnumerable<Patient>> GetPatients()
        {
            return Task.FromResult((IEnumerable<Patient>)_admittedPatients);
        }

        public Task<IEnumerable<Patient>> GetPatientsByPhysician(string id)
        {
            return Task.FromResult(_admittedPatients.Where(x => x.CaregiverId == id));
        }

        public Task<Patient> UpdatePatient(Patient patientModel)
        {
            return Task.FromResult(_admittedPatients[_admittedPatients.FindIndex(p => p.Id == patientModel.Id)] = patientModel);
        }
    }
}