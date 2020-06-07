import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { PatientModel, PatientService } from 'projects/shared/src/public-api';
import { PatientFeedComponent } from '../patient-feed.component'

@Component({
  selector: 'lib-patient-menu',
  templateUrl: './patient-menu.component.html',
  styleUrls: ['./patient-menu.component.css']
})
export class PatientMenuComponent implements OnInit {
  @Input() menuVisible: boolean;
  @Input() patientID: string;
  patient: PatientModel;

  constructor(private route: ActivatedRoute, private service: PatientService, private patientFeed: PatientFeedComponent) { }
  
  ngOnInit(): void {
    this.service.getPatient(this.patientID).subscribe((p) => {
      this.patient = p;
    });
  }

  toggleMenu() {
    this.patientFeed.toggleMenu();
  }
  
}
