import { PatientModel, PhysicianModel } from 'projects/shared/src/public-api';

export class ChangeShiftModel {
    patients: Array<PatientModel>;
    physicianId: string
    physician: PhysicianModel
}
