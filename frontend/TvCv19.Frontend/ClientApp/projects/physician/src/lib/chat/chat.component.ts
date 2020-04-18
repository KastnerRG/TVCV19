import { Component, OnInit } from '@angular/core';
import { ChatService, MessageModel } from '../chat.service';
import { ActivatedRoute } from '@angular/router';
import {
  AudioRecordingService,
} from '../audio-recording.service';
import { MessageService } from '../message.service';

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
  isRecording: boolean;
  recordedTime: string;

  constructor(
    private chatService: ChatService,
    private audioRecordingService: AudioRecordingService,
    private messageService: MessageService,
    route: ActivatedRoute
  ) {
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

    route.data.subscribe((data: { messages: MessageModel[] }) => {
      this.chatMessages = data.messages;
    });

    this.audioRecordingService
      .getRecordedTime()
      .subscribe((time: string) => (this.recordedTime = time));
  }

  ngOnInit(): void {}

  async sendMessage(): Promise<void> {
    await this.chatService.sendMessageAsync(
      this.patientId,
      this.physicianId,
      this.messageToSend,
      false
    );

    this.messageToSend = '';
  }

  async sendAudioMessage(fileName: string): Promise<void> {
    await this.chatService.sendMessageAsync(
      this.patientId,
      this.physicianId,
      fileName,
      false,
      true
    );
  }

  startRecording() {
    if (!this.isRecording) {
      this.audioRecordingService.startRecording();
      this.isRecording = true;
    } else {
      this.stopRecording();
    }
  }

  stopRecording() {
    this.audioRecordingService.stopRecording();
    this.isRecording = false;
    this.recordedTime = '';
    this.audioRecordingService.getRecordedBlob().subscribe((b) => {
      let recording = new File([b.blob], b.title);
      this.messageService
        .sendRecording({
          fileName: b.title,
          recording,
        })
        .subscribe(async (x) => {
          await this.sendAudioMessage(x.fileName);
        });
    });
  }

  play(message: MessageModel): void {
    if (message.isAudio) {
      this.messageService.getRecording(message.message).subscribe((x: any) => {
        let blob = new Blob([x], { type: 'audio/mpeg3' });
        let audioUrl = URL.createObjectURL(blob);
        let audio = new Audio(audioUrl);
        audio.play();
      });
    }
  }
}
