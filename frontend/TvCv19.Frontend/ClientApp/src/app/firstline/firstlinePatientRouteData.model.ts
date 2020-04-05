import { PatientModel } from '../patient-registration/patient-model';

export class FirstLinePatientRouteDataModel {
    patients: Array<PatientModel>;
    caregiverId: string
}