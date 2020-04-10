import { PatientModel } from '../../../../../../src/app/shared/models/patient-model';
import { PhysicianModel } from 'src/app/shared/models/physician-model';

export interface AssignCareGiverModel {
   patient: PatientModel
   caregivers: Array<PhysicianModel>
}