import { StatsData } from 'projects/shared-caregiver/src/lib/patient-stats/patient-stats.dialog';

export interface MessageModel {
    isImage: boolean;
    name: string;
    message: string;
    stats: StatsData;
    date: Date;
    id: string;
    patientId: string;
    physicianId: string;
    isCareInstruction: boolean;
    isAudio: boolean;
  }