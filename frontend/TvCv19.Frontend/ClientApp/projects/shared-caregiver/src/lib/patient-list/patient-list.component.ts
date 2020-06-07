import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PatientModel,
  PhysicianModel,
  CaregiverRouteDataModel,
  HierarchyLevel,
  MessageModel,
} from 'projects/shared/src/public-api';
import { ChatService } from '../chat.service';
import { ToolbarService, Message } from 'src/app/toolbar.service';
import { NotificationService, Notification } from '../notification.service';

@Component({
  selector: 'lib-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent implements OnInit {
  patients: Array<PatientAlertModel> = [];
  careTeam: Array<PhysicianModel> = [];
  isFirstLine: boolean;
  private id: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private toolbarService: ToolbarService,
    private notificationService: NotificationService
  ) {
    this.notificationService.notifications.subscribe(notification => {
      if(notification) {
        this.patients.map((patient) => (patient.id === notification.patientId ? (this.onNotification(patient, notification)) : patient.link = `/caregiver/${this.id}/patient/${patient.id}`));
      } 
    })

    this.toolbarService.deleteNotification.subscribe(notification => {
        this.patients.map(patient => patient.id === notification.patientId ? patient.alert = false : patient)
    })
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      async (data: { model: CaregiverRouteDataModel }) => {
        this.patients = data.model.patients || [];
        this.id = data.model.physician.id;
        this.setToolbar();

        this.patients.map(patient => patient.link = `/caregiver/${this.id}/patient/${patient.id}`)
        this.isFirstLine =
          data.model.physician.hierarchy === HierarchyLevel.FirstLine;
        this.careTeam = data.model.careTeam;
        for (let patient of this.patients) {
          await this.chatService.subscribeAsync(patient.id);
        }
        await this.notificationService.subscribeAsync(this.id);
      }
    );

    this.chatService.messages
      .subscribe((message: MessageModel) => {
        if(message.receiverId) {
          this.notificationService.addNotification({
            link: `/caregiver/${message.receiverId}/patient/${message.patientId}/chat`,
            recieverId: message.receiverId,
            senderId: message.physicianId,
            patientId: message.patientId
          })
        }
      });
  }

  async onClick(patient: PatientAlertModel) {
    if(patient.alert){
      await this.notificationService.delete(patient.notification.id).toPromise();
      this.toolbarService.deleteNotification.next(patient.notification);
    }
    this.router.navigateByUrl(patient.link);
  }

  private setToolbar() {
    this.toolbarService.setToolbarData({
      menu: [{ link: '', title: 'Shift change' }],
      title: 'Patient List',
      notificationReceiverId: this.id
    });
  }

  private onNotification(patient: PatientAlertModel, notification: Notification) {
    patient.alert = true
    patient.link = `/caregiver/${this.id}/patient/${patient.id}/chat`
    patient.notification = notification
  }
}



export class PatientAlertModel extends PatientModel {
  alert?: boolean;
  link?: string;
  notification?: Notification;
}
