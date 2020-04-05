import { PatientModel } from '../../../../../src/app/patient-registration/patient-model';
import { Physician } from './physician-heirachy.component';

export class FirstLinePatientRouteDataModel {
    patients: Array<PatientModel>;
    physicianId: string
    physicians: Array<Physician>
}