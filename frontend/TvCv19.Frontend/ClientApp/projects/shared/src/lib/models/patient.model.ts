export class PatientModel {
    id: string;
    name: string;
    location: string;
    caregiverId: string;
    addmissionStatus: AdmissionStatus;
    escalationLevel: number;
    token: string;
    username: string;
}

export class PatientRegistration {
  name: string;
  location: string;
  username: string;
  password: string;
}

export enum AdmissionStatus {
  Admitted,
  Discharged,
}
