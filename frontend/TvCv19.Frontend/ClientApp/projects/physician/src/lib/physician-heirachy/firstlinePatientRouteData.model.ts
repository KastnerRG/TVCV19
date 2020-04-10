import { PatientModel } from '../../../../../src/app/shared/models/patient-model';
import { PhysicianModel } from 'src/app/shared/models/physician-model';


export class FirstLinePatientRouteDataModel {
    patients: Array<PatientModel>;
    physicianId: string
    physicians: Array<PhysicianModel>
}