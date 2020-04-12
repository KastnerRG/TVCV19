import { PatientModel } from '../../../../../src/app/shared/models/patient-model';
import { PhysicianModel } from 'src/app/shared/models/physician-model';


export class ChangeShiftModel {
    patients: Array<PatientModel>;
    physicianId: string
    physician: PhysicianModel
}
