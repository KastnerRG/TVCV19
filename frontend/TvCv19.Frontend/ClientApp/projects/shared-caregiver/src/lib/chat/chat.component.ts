import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { ChatService } from '../chat.service';
import { AudioRecordingService } from '../audio-recording.service';
import { MediaService } from '../media.service';
import { MessageModel } from 'projects/shared/src/public-api';
import {
  PatientStatsDialog,
  StatsData,
} from '../patient-stats/patient-stats.dialog';

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
  private audioCache = {};

  @ViewChild('downloadImage') download: any;

  constructor(
    private chatService: ChatService,
    private audioRecordingService: AudioRecordingService,
    private mediaService: MediaService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    route: ActivatedRoute
  ) {
    chatService.messages.subscribe((m) => {
      this.chatMessages.push(m);
    });

    route.parent.params.subscribe((p: any) => {
      this.patientId = p['id'];

      this.chatService.subscribeAsync(this.patientId);
    });

    route.parent.parent.params.subscribe((p) => {
      this.physicianId = p['id'];
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
      null,
      false
    );

    this.messageToSend = '';
  }

  async sendAudioMessage(fileName: string): Promise<void> {
    await this.chatService.sendMessageAsync(
      this.patientId,
      this.physicianId,
      fileName,
      null,
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
      null,
      false,
      false,
      true
    );
  }

  async sendRespiratorStats(stats: StatsData): Promise<void> {
    await this.chatService.sendMessageAsync(
      this.patientId,
      this.physicianId,
      this.messageToSend,
      stats,
      false
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

  getMedia(message: MessageModel): void {
    if (message.isAudio || message.isImage) {
      const fileName = message.message;
      if (this.audioCache[fileName]) {
        this.audioCache[fileName].play();
        return;
      }
      this.mediaService.getMedia(fileName).subscribe((blob: Blob) => {
        if (message.isAudio) {
          this.playAudio(blob, fileName);
        } else if (message.isImage) {
          this.downloadImage(fileName, blob);
        }
      });
    }
  }

  uploadStats() {
    const dialogRef = this.dialog.open(PatientStatsDialog, {
      width: '80vw',
      data: { stats: { pr: '', tv: '', pp: '', ie: '', mp: '', o2: '' } },
    });

    dialogRef.afterClosed().subscribe(async (result: StatsData) => {
      if (result) await this.sendRespiratorStats(result);
    });
  }

  imgInputChange(fileInputEvent: any): void {
    const file: File = fileInputEvent.target.files[0];
    this.mediaService
      .sendMedia({ file, fileName: file.name, mimeType: file.type })
      .subscribe(async () => {
        await this.sendPictureMessage(file.name);
      });
  }

  private stopRecording() {
    this.audioRecordingService.stopRecording();
    this.isRecording = false;
    this.recordedTime = '';
    this.audioRecordingService
      .getRecordedBlob()
      .pipe(first())
      .subscribe((b) => {
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

  private downloadImage(fileName, blob: Blob) {
    this.downloadedImage.fileName = fileName;
    this.downloadedImage.url = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(blob)
    );
    setTimeout(() => this.download.nativeElement.click(), 200);
  }

  private playAudio(x: Blob, fileName: string) {
    let blob = new Blob([x], { type: 'audio/mpeg3' });
    let audioUrl = URL.createObjectURL(blob);
    let audio = new Audio(audioUrl);
    this.audioCache[fileName] = audio;
    audio.play();
  }
}
