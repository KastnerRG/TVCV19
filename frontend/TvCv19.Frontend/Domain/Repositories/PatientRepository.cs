using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain
{


    public class PatientRepository : BaseRepository, IPatientRepository
    {
        public async Task<string> AdmitPatient(Patient patient)
        {
            var sql = @$"INSERT INTO medecc.patient
                        (id, name, caregiver_id, location)
                        VALUES (@Id, @Name, @CaregiverId, @Location)";
            await ExecuteAsync<Patient>(sql, patient);
            return patient.Id;
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
            var sql = $@"SELECT patients.id, name, caregiver_id as caregiverId, location, admission_status as admissionStatus,
                         escalation_level as escalationLevel, token, user_name as username 
                         FROM medecc.patient as patients
                         LEFT JOIN medecc.users as users
                         ON users.id = patients.id
                         WHERE patients.id = @id AND admission_status = @AdmissionStatus";
            return await GetFirstOrDefaultAsync<Patient>(sql, param);
        }

        public async Task<IEnumerable<Patient>> GetPatients()
        {
            var param = new { AdmissionStatus = AdmissionStatus.Admitted };
            var sql = $@"SELECT patients.id, name, caregiver_id as caregiverId, location, admission_status as admissionStatus,
                         escalation_level as escalationLevel, token, user_name as username 
                         FROM medecc.patient as patients
                         LEFT JOIN medecc.users as users
                         ON users.id = patients.id
                         WHERE admission_status = @AdmissionStatus";

            return await GetAsync<Patient>(sql, param);
        }

        public async Task<IEnumerable<Patient>> GetPatientsByPhysician(string id)
        {
            var param = new { id, AdmissionStatus = AdmissionStatus.Admitted };
            var sql = @"WITH
                          firstLevelTeam AS (
                                             SELECT id FROM medecc.caregiver
                                             WHERE supervisor_id = @id
					      ),
                          secondLevelTeam AS (
                                               SELECT id FROM medecc.caregiver
                                               WHERE supervisor_id in(SELECT id FROM firstLevelTeam) 
					      )
                         
                          SELECT patient.id, patient.name, patient.caregiver_id as caregiverId, patient.location, patient.admission_status as admissionStatus,
                                            escalation_level as escalationLevel, token
                                            FROM medecc.patient as patient
					                        WHERE patient.caregiver_id in (
                                                                            SELECT * FROM firstLevelTeam
                                                                            UNION ALL
                                                                            SELECT * FROM secondLevelTeam
                                                                           )
					      OR patient.caregiver_id = @id
                          AND patient.admission_status = @AdmissionStatus";
            return await GetAsync<Patient>(sql, param);
        }

        public async Task<Patient> UpdatePatient(Patient patient)
        {
            var sql = @"UPDATE medecc.patient
                         SET name = @Name, caregiver_id = @CaregiverId, location = @Location, admission_status = @AdmissionStatus,
                         escalation_level = @EscalationLevel, token = @Token
                         WHERE  id = @Id";
            await ExecuteAsync<Patient>(sql, patient);
            return patient;
        }
    }
}