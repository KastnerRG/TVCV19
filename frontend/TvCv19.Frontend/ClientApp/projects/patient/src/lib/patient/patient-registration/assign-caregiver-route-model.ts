import { PatientModel, PhysicianModel } from 'projects/shared/src/public-api';

export interface AssignCareGiverModel {
   patient: PatientModel
   caregivers: Array<PhysicianModel>
}