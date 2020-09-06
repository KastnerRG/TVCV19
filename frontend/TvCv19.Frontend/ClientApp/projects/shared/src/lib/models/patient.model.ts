export class PatientModel {
  id: string;
  name: string;
  location: string;
  gender: Gender;
  height: string;
  dateOfBirth: string;
  caregiverId: string;
  addmissionStatus: AdmissionStatus;
  escalationLevel: number;
  token: string;
  username: string;
}

export class PatientRegistration {
  name: string;
  location: string;
  gender: Gender;
  height: string;
  dateOfBirth: string;
  username: string;
  password: string;
}

export enum Gender {
  Male,
  Female,
}

export enum AdmissionStatus {
  Admitted,
  Discharged,
}
