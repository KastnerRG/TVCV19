import { Moment } from 'moment';

export class PatientModel {
    id: string;
    name: string;
    location: string;
    caregiverId: string;
    addmissionStatus: AdmissionStatus;
    escalationLevel: number;
    token: string;
    gender: Gender;
    height: string;
    dateOfBirth: string;
}

export enum AdmissionStatus {
    Admitted,Discharged
}

export enum Gender {
    Male,Female
}