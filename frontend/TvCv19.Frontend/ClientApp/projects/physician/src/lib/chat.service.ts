import { Injectable } from '@angular/core';

import { HubConnectionBuilder, HubConnection, LogLevel, HubConnectionState } from '@microsoft/signalr';
import { Subject, Observable } from 'rxjs';

export interface MessageModel {
  name: string;
  message: string;
  date: Date
  isCareInstruction: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private connection: HubConnection;
  private messagesSubject: Subject<MessageModel> = new Subject();

  messages: Observable<MessageModel>;

  constructor() {
    this.messages = this.messagesSubject.asObservable();

    this.connection = new HubConnectionBuilder()
      .withUrl("/hubs/chat")
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.on('ReceiveMessage', (message: string, name: string, date: Date, isCareInstruction: boolean) => {
      this.messagesSubject.next({
        name,
        message,
        date,
        isCareInstruction
      });
    });
  }

  async subscribeAsync(patientId: string): Promise<void> {
    if (typeof patientId === 'undefined' || !patientId) {
      return;
    }

    await this.connectAsync();
    await this.connection.invoke("SubscribeAsync", patientId);
  }

  async sendMessageAsync(patientId: string, physicianId: string, message: string, isCareInstruction: boolean): Promise<void> {
    await this.connectAsync();
    await this.connection.invoke("SendMessageAsync", patientId, physicianId, message, isCareInstruction);
  }

  private async connectAsync(): Promise<void> {
    if (this.connection.state !== HubConnectionState.Connected) {
      await this.connection.start();
    }
  }
}
