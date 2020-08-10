import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolbarService } from 'src/app/toolbar.service';
import { PatientService } from 'projects/shared/src/public-api';

@Component({
  selector: 'lib-patient-feed',
  templateUrl: './patient-feed.component.html',
  styleUrls: ['./patient-feed.component.scss']
})
export class PatientFeedComponent implements OnInit {
  room: number;
  token: string;
  constructor(route: ActivatedRoute, private toolbarService: ToolbarService, private patientService: PatientService) {
    route.params.subscribe(async (p) => {
      this.room = p['id'];
      const patient = await this.patientService.getPatient(this.room).toPromise();
      this.token = patient.token;
    });

  }

  ngOnInit(): void {
    this.toolbarService.setToolbarData({})
  }

}
