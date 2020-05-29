import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'lib-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss'],
})
export class PatientDetailComponent implements OnInit {
  room: any;

  constructor(route: ActivatedRoute) {
    route.params.subscribe((p) => {
      this.room = p['id'];
    });

  }

  ngOnInit(): void {}
}
