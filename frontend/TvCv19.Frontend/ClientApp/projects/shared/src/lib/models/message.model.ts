import { StatsData } from 'projects/caregiver/src/lib/patient-stats/patient-stats.dialog';

export interface MessageModel {
    isImage: boolean;
    name: string;
    message: string;
    stats: StatsData;
    date: Date;
    id: string;
    patientId: string;
    physicianId: string;
    receiverId: string;
    isCareInstruction: boolean;
    isAudio: boolean;
    isEscalation: boolean;
  }