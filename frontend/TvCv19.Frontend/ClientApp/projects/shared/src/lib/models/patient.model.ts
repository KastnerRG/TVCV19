export class PatientModel {
    id: string;
    name: string;
    location: string;
    caregiverId: string;
    addmissionStatus: AdmissionStatus;
    escalationLevel: number;
    token: string;
}

export enum AdmissionStatus {
    Admitted,Discharged
}