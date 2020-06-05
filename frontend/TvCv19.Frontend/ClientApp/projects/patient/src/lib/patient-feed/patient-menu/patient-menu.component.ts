import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { PatientModel, PatientService } from 'projects/shared/src/public-api';

@Component({
  selector: 'lib-patient-menu',
  templateUrl: './patient-menu.component.html',
  styleUrls: ['./patient-menu.component.css']
})
export class PatientMenuComponent implements OnInit {
  @Input() showMenu: boolean;
  @Input() patientID: string;
  patient: PatientModel;

  constructor(private route: ActivatedRoute, private service: PatientService) { }
  
  ngOnInit(): void {
    this.service.getPatient(this.patientID).subscribe((p) => {
      this.patient= p;
    });
  }
  
}
