import { PatientModel } from '../../../../../src/app/patient-registration/patient-model';
import { PhysicianModel } from 'src/app/physician-admin/physician-model';


export class FirstLinePatientRouteDataModel {
    patients: Array<PatientModel>;
    physicianId: string
    physicians: Array<PhysicianModel>
}