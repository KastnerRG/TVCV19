import { PatientModel, PhysicianModel } from 'projects/shared/src/public-api';

export class FirstLinePatientRouteDataModel {
    patients: Array<PatientModel>;
    physicianId: string
    physicians: Array<PhysicianModel>
}