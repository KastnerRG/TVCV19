import { PatientModel } from './patient.model';
import { PhysicianModel } from '../../public-api';

export class FirstLinePatientRouteDataModel {
    patients: Array<PatientModel>;
    physicianId: string
    physicians: Array<PhysicianModel>
}