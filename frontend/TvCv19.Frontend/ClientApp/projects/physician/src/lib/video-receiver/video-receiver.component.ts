import { Component, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';

import DailyIframe from '@daily-co/daily-js';

@Component({
  selector: 'app-video-receiver',
  templateUrl: './video-receiver.component.html',
  styleUrls: ['./video-receiver.component.scss']
})
export class VideoReceiverComponent implements AfterViewInit {

  @Input() patientID: string;
  @ViewChild('videoFrame') iframeView: ElementRef;

  constructor() { }

  async ngAfterViewInit(): Promise<void> {
    const callFrame = DailyIframe.wrap(this.iframeView.nativeElement);
    // await callFrame.join({ url: `https://tvcv19.daily.co/${this.patientID}` });
    await callFrame.join({ url: `https://tvcv19.daily.co/hello` });

    // Since we are the viewer, automatically disable the video.
    // We will hide the controls so that the volunteer cannot enable video.
    callFrame
      .setLocalAudio(false)
      .setLocalVideo(false);
  }

}
