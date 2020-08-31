import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientModel } from 'projects/shared/src/public-api';
import { ToolbarService } from 'src/app/toolbar.service';
import { ChatService } from 'projects/caregiver/src/lib/chat.service';

@Component({
  selector: 'assign-caregiver',
  templateUrl: './assign-caregiver.component.html',
  styleUrls: ['./assign-caregiver.component.scss'],
})
export class AssignCareGiverComponent implements OnInit {
  patient: PatientModel;

  constructor(private route: ActivatedRoute, private router: Router, private toolbarService: ToolbarService, private chatService: ChatService) { 
    this.toolbarService.setToolbarData({});
    this.chatService.assignCaregiverSubject.subscribe(id => {
       this.router.navigate(['patient', 'live', this.patient.id])
    });
    this.route.data.subscribe((data: { model: PatientModel }) => {
      this.patient = data.model;
    });
  }

  ngOnInit(): void {
    this.chatService.subscribeAsync(this.patient.id)
  }
}
