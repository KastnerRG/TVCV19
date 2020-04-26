import { PatientModel } from './patient.model';
import { PhysicianModel } from '../../public-api';

export class CaregiverRouteDataModel {
    patients: Array<PatientModel>;
    id: string
    careTeam: Array<PhysicianModel>
}