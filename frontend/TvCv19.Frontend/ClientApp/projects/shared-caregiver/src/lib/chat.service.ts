import { Injectable } from '@angular/core';
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
  HubConnectionState,
} from '@microsoft/signalr';
import { Subject, Observable } from 'rxjs';
import { AuthorizationService, MessageModel } from 'projects/shared/src/public-api';
import { StatsData } from './patient-stats/patient-stats.dialog';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private connection: HubConnection;
  private messagesSubject: Subject<MessageModel> = new Subject();

  messages: Observable<MessageModel>;

  constructor(authService: AuthorizationService) {
    this.messages = this.messagesSubject.asObservable();

    this.connection = new HubConnectionBuilder()
      .withUrl('/hubs/chat', { accessTokenFactory: () => authService.getToken() })
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.on('ReceiveMessage', (message: MessageModel) => {
      this.messagesSubject.next(message);
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

  private async connectAsync(): Promise<void> {
    if (this.connection.state !== HubConnectionState.Connected) {
      await this.connection.start();
    }
  }
}
