import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService, MessageModel } from '../chat.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AudioRecordingService } from '../audio-recording.service';
import { MediaService } from '../media.service';
import { first } from 'rxjs/operators';

export interface DownloadedImage {
  url: SafeUrl;
  fileName: string;
}

@Component({
  selector: 'lib-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  private patientId: string;
  private physicianId: string;
  public messageToSend: string = '';
  public chatMessages: MessageModel[];
  public isRecording: boolean;
  public recordedTime: string;
  public downloadedImage: DownloadedImage = { url: '', fileName: '' };

  @ViewChild('downloadImage') download: any;

  constructor(
    private chatService: ChatService,
    private audioRecordingService: AudioRecordingService,
    private mediaService: MediaService,
    private sanitizer: DomSanitizer,
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
      true,
      false
    );
  }

  async sendPictureMessage(fileName: string): Promise<void> {
    await this.chatService.sendMessageAsync(
      this.patientId,
      this.physicianId,
      fileName,
      false,
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
    this.audioRecordingService.getRecordedBlob().pipe(first()).subscribe((b) => {
      let file = new File([b.blob], b.title);
      this.mediaService
        .sendMedia({
          fileName: b.title,
          file,
          mimeType: 'audio/mpeg',
        })
        .subscribe(async (x) => {
          await this.sendAudioMessage(x.fileName);
        });
    });
  }

  getMedia(message: MessageModel): void {
    if (message.isAudio || message.isImage) {
      this.mediaService.getMedia(message.message).subscribe((blob: Blob) => {
        if (message.isAudio) {
          this.playAudio(blob);
        } else if (message.isImage) {
          this.downloadImage(message, blob);
        }
      });
    }
  }

  private downloadImage(message: MessageModel, blob: Blob) {
    this.downloadedImage.fileName = message.message;
    this.downloadedImage.url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    setTimeout(() => this.download.nativeElement.click(), 200);
  }

  private playAudio(x: Blob) {
    let blob = new Blob([x], { type: 'audio/mpeg3' });
    let audioUrl = URL.createObjectURL(blob);
    let audio = new Audio(audioUrl);
    audio.play();
  }

  imgInputChange(fileInputEvent: any): void {
    const file: File = fileInputEvent.target.files[0];
    this.mediaService
      .sendMedia({ file, fileName: file.name, mimeType: file.type })
      .subscribe(async (x) => {
        await this.sendPictureMessage(file.name);
      });
  }
}
