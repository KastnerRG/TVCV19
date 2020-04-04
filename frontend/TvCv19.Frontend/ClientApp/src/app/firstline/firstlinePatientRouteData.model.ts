import { PatientModel } from '../patient-admin/patient-model';

export class FirstLinePatientRouteDataModel {
    patients: Array<PatientModel>;
    caregiverId: string
}