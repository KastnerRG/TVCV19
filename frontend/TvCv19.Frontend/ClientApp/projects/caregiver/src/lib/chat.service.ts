import { Injectable } from '@angular/core';
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
  HubConnectionState,
} from '@microsoft/signalr';
import { Subject, Observable } from 'rxjs';
import { MessageModel, PatientModel, AuthorizationService } from 'projects/shared/src/public-api';
import { StatsData } from './patient-stats/patient-stats.dialog';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private connection: HubConnection;
  private messagesSubject: Subject<MessageModel> = new Subject();
  assignCaregiverSubject: Subject<string> = new Subject();

  messages: Observable<MessageModel>;

  constructor(private authorizationService: AuthorizationService) {
    this.messages = this.messagesSubject.asObservable();

    this.connection = new HubConnectionBuilder()
      .withUrl('/hubs/chat', { accessTokenFactory: () => this.authorizationService.getToken() })
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.on('ReceiveMessage', (message: MessageModel) => {
      this.messagesSubject.next(message);
    });

    this.connection.on('AssignCaregiver', (id: string) => {
      this.assignCaregiverSubject.next(id);
    });
  }

  async subscribeAsync(patientId: string): Promise<void> {
    if (typeof patientId === 'undefined' || !patientId) {
      return;
    }

    await this.connectAsync();
    await this.connection.invoke('SubscribeAsync', patientId);
  }

  async sendMessageAsync(
    patientId: string,
    physicianId: string,
    message: string,
    stats?: StatsData,
    isCareInstruction?: boolean,
    isAudio?: boolean,
    isImage?: boolean,
    isEscalation?: boolean
  ): Promise<void> {
    await this.connectAsync();
    await this.connection.invoke(
      'SendMessageAsync',
      patientId,
      physicianId,
      message,
      stats,
      isCareInstruction,
      isAudio,
      isImage,
      isEscalation
    );
  }

  async assignCareGiver(patient: PatientModel) : Promise<string> {
    await this.connection.invoke('AssignCaregiver', patient)
    return patient.id;
  }

  private async connectAsync(): Promise<void> {
    if (this.connection.state !== HubConnectionState.Connected) {
      await this.connection.start();
    }
  }
}
