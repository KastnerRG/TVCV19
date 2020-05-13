import { PatientModel } from './patient.model';
import { PhysicianModel } from '../../public-api';

export class CaregiverRouteDataModel {
    patients: Array<PatientModel>;
    careTeam: Array<PhysicianModel>
    physician: PhysicianModel
}