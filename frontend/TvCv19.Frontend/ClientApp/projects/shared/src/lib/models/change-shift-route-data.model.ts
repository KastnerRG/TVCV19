import { PhysicianModel, PatientModel } from '../../public-api';

export interface ChangeShiftRouteDataModel {
    careTeam: Array<PhysicianModel>;
    patient: PatientModel
  }