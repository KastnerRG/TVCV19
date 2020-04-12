import { Component, OnInit } from '@angular/core';
import { ChatService, MessageModel } from '../chat.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  private patientId: string;
  private physicianId: string;

  messageToSend: string = '';
  chatMessages: MessageModel[];

  constructor(private chatService: ChatService, route: ActivatedRoute) {
    
    chatService.messages.subscribe((m) => {
      this.chatMessages.push(m);
    });
    
    route.params.subscribe((p) => {
      this.patientId = p['patient-id'];

      this.chatService.subscribeAsync(this.patientId);
    });

    route.parent.params.subscribe((p) => {
      this.physicianId = p['physician-id'];
    });

    route.data.subscribe((data: { messages: MessageModel[]}) => {
      this.chatMessages = data.messages;
    });
  }

  ngOnInit(): void {
  
  }

  async clickAsync(): Promise<void> {
    await this.chatService.sendMessageAsync(
      this.patientId,
      this.physicianId,
      this.messageToSend,
      false
    );

    this.messageToSend = '';
  }
}
