import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';

import DailyIframe from '@daily-co/daily-js';

@Component({
  selector: 'lib-video-receiver',
  templateUrl: './video-receiver.component.html',
  styleUrls: ['./video-receiver.component.scss'],
})
export class VideoReceiverComponent implements AfterViewInit {
  @Input() room: string;
  @Input() isBroadcaster: boolean;
  @ViewChild('videoFrame') iframeView: ElementRef;

  constructor() {}

  async ngAfterViewInit(): Promise<void> {
    const callFrame = DailyIframe.wrap(this.iframeView.nativeElement, {
      url: `https://tvcv19.daily.co/${this.room}`,
      customLayout: true,

      //cssText: '.bPUIgr { display: none;} .kESwUz { display: none;} .feIhtO { display: none;} .liJcDz { display: none;}'
      cssText: `.daily-video-div { visibility: visible; width: 100%; height: 100%; }`
    });
    await callFrame.join();
    // Since we are the viewer, automatically disable the video.
    // We will hide the controls so that the volunteer cannot enable video.
    callFrame.setLocalAudio(false).setLocalVideo(this.isBroadcaster);
  }
}
