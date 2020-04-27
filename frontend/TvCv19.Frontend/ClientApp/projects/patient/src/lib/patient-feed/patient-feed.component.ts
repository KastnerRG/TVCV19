import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-patient-feed',
  templateUrl: './patient-feed.component.html',
  styleUrls: ['./patient-feed.component.scss']
})
export class PatientFeedComponent implements OnInit {
  room: string;
  constructor(route: ActivatedRoute) {
    route.params.subscribe((p) => {
      this.room = `patient-${p['id']}`;
    });

  }

  ngOnInit(): void {
  }

}
