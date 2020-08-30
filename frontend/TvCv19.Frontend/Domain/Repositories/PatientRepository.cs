using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TvCv19.Frontend.Domain
{


    public class PatientRepository : BaseRepository, IPatientRepository
    {
        public async Task<string> AdmitPatient(Patient patient)
        {
            var id = Guid.NewGuid().ToString().Replace("-", string.Empty);
            var sql = @$"INSERT INTO medecc.patient
                        (id, name, caregiver_id, location, gender, height, date_of_birth)
                        VALUES ('{id}', @Name, @CaregiverId, @Location, @Gender, @Height, DATE_FORMAT(STR_TO_DATE(@DateOfBirth, '%Y-%m-%dT%H:%i:%s.000Z'), '%Y-%m-%d'))";
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
            var sql = $@"SELECT id, name, caregiver_id as caregiverId, location, admission_status as admissionStatus,
                         escalation_level as escalationLevel, token, gender, height, date_of_birth as dateOfBirth
                         FROM medecc.patient
                         WHERE id = @id AND admission_status = @AdmissionStatus";
            return await GetFirstOrDefaultAsync<Patient>(sql, param);
        }

        public async Task<IEnumerable<Patient>> GetPatients()
        {
            var param = new { AdmissionStatus = AdmissionStatus.Admitted };
            var sql = $@"SELECT id, name, caregiver_id as caregiverId, location, admission_status as admissionStatus,
                         escalation_level as escalationLevel, token, gender, height, date_of_birth as dateOfBirth
                         FROM medecc.patient
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
                                            escalation_level as escalationLevel, token, gender, height, date_of_birth as dateOfBirth
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
                         escalation_level = @EscalationLevel, token = @Token, gender = @Gender, height = @Height
                         WHERE  id = @Id";
            await ExecuteAsync<Patient>(sql, patient);
            return patient;
        }
    }
}