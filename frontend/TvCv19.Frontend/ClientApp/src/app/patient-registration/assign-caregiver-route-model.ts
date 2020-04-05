import { Caregiver } from './assign-caregiver.component';
import { PatientModel } from './patient-model';

export interface AssignCareGiverModel {
   patient: PatientModel
   caregivers: Array<Caregiver>
}