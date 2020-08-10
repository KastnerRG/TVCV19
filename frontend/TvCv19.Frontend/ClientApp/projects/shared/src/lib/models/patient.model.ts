export class PatientModel {
    id: number;
    name: string;
    location: string;
    caregiverId: number;
    addmissionStatus: AdmissionStatus;
    escalationLevel: number;
    token: string;
}

export enum AdmissionStatus {
  Admitted,
  Discharged,
}
