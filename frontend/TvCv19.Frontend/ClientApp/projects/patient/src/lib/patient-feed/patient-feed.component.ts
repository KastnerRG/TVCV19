import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientFeedModel } from './patient-feed-model';

@Component({
  selector: 'lib-patient-feed',
  templateUrl: './patient-feed.component.html',
  styleUrls: ['./patient-feed.component.scss']
})
export class PatientFeedComponent {
  room: string;
  token: string;
  
  constructor(route: ActivatedRoute) {
    route.data.subscribe((data: {model: PatientFeedModel }) => {
      this.room = data.model.id
      this.token = data.model.token;
    });
  }
}
