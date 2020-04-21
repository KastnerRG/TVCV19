import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-live-video',
  templateUrl: './live-video.component.html',
  styleUrls: ['./live-video.component.scss']
})
export class LiveVideoComponent implements OnInit {
  patientID: number;

  constructor(route: ActivatedRoute) {
    this.patientID = route['patient-id'];
  }

  ngOnInit(): void {
  }

}
