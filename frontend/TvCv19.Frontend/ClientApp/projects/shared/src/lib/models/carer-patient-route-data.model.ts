import { PhysicianModel, PatientModel } from '../../public-api';

export interface CarerPatientRouteDataModel {
    careTeam: Array<PhysicianModel>;
    patient: PatientModel
  }