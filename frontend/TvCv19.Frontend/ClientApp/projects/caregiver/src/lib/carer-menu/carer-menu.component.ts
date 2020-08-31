import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PhysicianModel,
  PhysicianService,
  PatientService,
} from 'projects/shared/src/public-api';
import { ToolbarService } from 'src/app/toolbar.service';
import { ChatService } from '../chat.service';
import { UserService, User } from 'projects/shared/src/lib/services/user.service';

@Component({
  selector: 'lib-carer-menu',
  templateUrl: './carer-menu.component.html',
  styleUrls: ['./carer-menu.component.scss'],
})
export class CarerMenuComponent {
  showQR: boolean;
  scanPatientQr: boolean;
  user: User;

  constructor(
    userService: UserService,
    private toolbarService: ToolbarService,
    private patientService: PatientService,
    private chatservice: ChatService,
    private router: Router
  ) {
     this.user = userService.getUser();
  }
  toggleQr() {
    this.showQR = !this.showQR;
  }
  close() {
    this.toolbarService.onMenuClick();
  }

  async addPatient(patientId: string): Promise<void> {
    this.scanPatientQr = false;
    await this.chatservice.subscribeAsync(patientId);
    this.patientService.getPatient(patientId).subscribe((patient) => {
      patient.caregiverId = this.user.id;
      this.chatservice.assignCareGiver(patient).then((id) => {
        this.router.navigate(['caregiver', this.user.id, 'patient', id]);
      });
    });
  }
}
