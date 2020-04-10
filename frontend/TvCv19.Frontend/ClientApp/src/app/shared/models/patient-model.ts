export class PatientModel {
    id: string;
    name: string;
    location: string;
    caregiverId: string;
    addmissionStatus: AdmissionStatus;
}

export enum AdmissionStatus {
    Admitted,Discharged
}