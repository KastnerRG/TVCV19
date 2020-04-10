import { Caregiver } from './assign-caregiver.component';
import { PatientModel } from '../../../../../../src/app/shared/models/patient-model';

export interface AssignCareGiverModel {
   patient: PatientModel
   caregivers: Array<Caregiver>
}