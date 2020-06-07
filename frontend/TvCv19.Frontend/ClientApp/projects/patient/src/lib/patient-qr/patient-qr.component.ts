import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToolbarService } from 'src/app/toolbar.service';
import { PatientModel, PatientService } from 'projects/shared/src/public-api';

@Component({
  selector: 'lib-patient-qr',
  templateUrl: './patient-qr.component.html',
  styleUrls: ['./patient-qr.component.css']
})
export class PatientQrComponent implements OnInit {
  id: string;
  patient: PatientModel;

  constructor(route: ActivatedRoute, private toolbar: ToolbarService, private service: PatientService) {
    route.params.subscribe((p) => {
      this.id = p['id'];
    });
  }

  ngOnInit(): void {
    this.service.getPatient(this.id).subscribe((p) => {
      this.patient = p;
    });

    this.toolbar.show();
    this.toolbar.setToolbarData({
      back: true
    });
  }

}
