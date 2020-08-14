import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolbarService } from 'src/app/toolbar.service';
import { PatientService } from 'projects/shared/src/public-api';
import { PatientFeedModel } from './patient-feed-model';

@Component({
  selector: 'lib-patient-feed',
  templateUrl: './patient-feed.component.html',
  styleUrls: ['./patient-feed.component.scss']
})
export class PatientFeedComponent {
  room: number;
  token: string;
  constructor(route: ActivatedRoute) {
    route.data.subscribe((data: {model: PatientFeedModel }) => {
      this.room = data.model.id
      this.token = data.model.token;
    });
  }
}
