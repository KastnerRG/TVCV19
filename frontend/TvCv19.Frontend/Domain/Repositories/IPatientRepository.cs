using System;
using System.Collections.Generic;
using System.Linq;

namespace TvCv19.Frontend.Domain
{
    public interface IPatientRepository
    {
        string AdmitPatient(Patient patient);
        string DischargePatient(string id);
        //  string RegisterCareGiver(RegisterCareGiverModel registerCareGiverModel);
        // SetPatientChartModel SetPatientChart(string id, List<VentilatorData> ventilatorData);
        //   EnterPatientReadingsModel EnterPatientReadings(string id, List<VentilatorData> ventilatorData);

    }

    public class PatientRepository : IPatientRepository
    {
        private List<Patient> _admittedPatients = new List<Patient>();


        public string AdmitPatient(Patient patient)
        {
            _admittedPatients.Add(patient);
            return patient.Id;
        }

        public string DischargePatient(string id)
        {
            _admittedPatients.Remove(_admittedPatients.FirstOrDefault(x => x.Id == id));
            return id;
        }

      
    }
}
