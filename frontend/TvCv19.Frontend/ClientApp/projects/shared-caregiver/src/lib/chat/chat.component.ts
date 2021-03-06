import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
import { ToolbarService } from 'src/app/toolbar.service';

export interface DownloadedImage {
  url: SafeUrl;
  fileName: string;
}

@Component({
  selector: 'lib-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  private patientId: string;
  private physicianId: string;
  public messageToSend: string = '';
  public chatMessages: MessageModel[];
  public isRecording: boolean;
  public recordedTime: string;
  public downloadedImage: DownloadedImage = { url: '', fileName: '' };
  public show: boolean = true;
  private audioCache = {};

  @ViewChild('downloadImage') download: any;
  @ViewChild('messages') private messageContainer: ElementRef;

  constructor(
    private chatService: ChatService,
    private audioRecordingService: AudioRecordingService,
    private mediaService: MediaService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    route: ActivatedRoute,
    toolbarService: ToolbarService
  ) {
    chatService.messages.subscribe((m) => {
      if(m.patientId === this.patientId){
        this.chatMessages.push(m);
      }
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

     toolbarService.menuClick.subscribe((e) => {
        this.show = !e.isOpen;
     });
  }

  ngOnInit(): void {}

  ngAfterViewChecked() {        
    this.scrollToBottom();        
} 

  async sendMessage(): Promise<void> {
    await this.chatService.sendMessageAsync(
      this.patientId,
      this.physicianId,
      this.messageToSend,
      null,
      false,
      false,
      false,
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
      false,
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
      true,
      false
    );
  }

  async sendRespiratorStats(stats: StatsData): Promise<void> {
    await this.chatService.sendMessageAsync(
      this.patientId,
      this.physicianId,
      this.messageToSend,
      stats,
      false,
      false,
      false,
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
      const fileId = message.message;
      if (this.audioCache[fileId]) {
        this.audioCache[fileId].play();
        return;
      }
      this.mediaService.getMedia(fileId).subscribe((blob: Blob) => {
        if (message.isAudio) {
          this.playAudio(blob, fileId);
        } else if (message.isImage) {
          this.downloadImage(fileId, blob);
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
      .subscribe(async (x) => {
        await this.sendPictureMessage(x.id);
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
            await this.sendAudioMessage(x.id);
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

  private scrollToBottom(): void {
    try {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
}
}
