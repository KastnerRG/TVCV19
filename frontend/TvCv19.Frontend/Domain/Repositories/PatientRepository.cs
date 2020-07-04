﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain
{


    public class PatientRepository : BaseRepository, IPatientRepository
    {
        public async Task<string> AdmitPatient(Patient patient)
        {
            var id = Guid.NewGuid().ToString().Replace("-",string.Empty);
            var sql = @$"INSERT INTO medecc.patient
                        (id, name, caregiver_id, location)
                        VALUES ('{id}', @Name, @CaregiverId, @Location)";
            await ExecuteAsync<Patient>(sql, patient);
            return id.ToString();
        }

        public async Task<string> DischargePatient(string id)
        {
            var param = new { id, AdmissionStatus = AdmissionStatus.Discharged };
            var sql = @$"UPDATE medecc.patient
                         SET admission_status = @AdmissionStatus
                         WHERE id = @id";

            await ExecuteAsync<Patient>(sql, param);
            return id;
        }

        public async Task<Patient> GetPatient(string id)
        {
            var param = new { id, AdmissionStatus = AdmissionStatus.Admitted };
            var sql = $@"SELECT id, name, caregiver_id as caregiverId, location, admission_status as admissionStatus
                         FROM medecc.patient
                         WHERE id = @id AND admission_status = @AdmissionStatus";
            return await GetFirstOrDefaultAsync<Patient>(sql, param);
        }

        public async Task<IEnumerable<Patient>> GetPatients()
        {
            var param = new { AdmissionStatus = AdmissionStatus.Admitted };
            var sql = $@"SELECT id, name, caregiver_id as caregiverId, location, admission_status as admissionStatus
                         FROM medecc.patient
                         WHERE admission_status = @AdmissionStatus";

            return await GetAsync<Patient>(sql, param);
        }

        public async Task<IEnumerable<Patient>> GetPatientsByPhysician(string id)
        {
            var param = new { id, AdmissionStatus = AdmissionStatus.Admitted };
            var sql = $@"SELECT patient.id, patient.name, patient.caregiver_id as caregiverId, patient.location, patient.admission_status as admissionStatus
                     FROM medecc.patient as patient
                     JOIN medecc.caregiver as caregiver
                     ON caregiver.id = patient.caregiver_id
                     WHERE caregiver.id in(SELECT id FROM medecc.caregiver
                                           WHERE supervisor_id = @id)
                     OR patient.caregiver_id = @id
                     AND patient.admission_status = @AdmissionStatus";
            return await GetAsync<Patient>(sql, param);
        }

        public async Task<Patient> UpdatePatient(Patient patient)
        {
            var sql = @$"UPDATE medecc.patient
                         SET name = @Name, caregiver_id = @CaregiverId, location = @Location, admission_status = @AdmissionStatus
                         WHERE  id = @Id";
            await ExecuteAsync<Patient>(sql, patient);
            return patient;
        }
    }
}