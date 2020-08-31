import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PatientModel,
  PhysicianModel,
  CaregiverRouteDataModel,
} from 'projects/shared/src/public-api';
import { ToolbarService } from 'src/app/toolbar.service';
import { NotificationService, Notification } from '../notification.service';
import { Subscription } from 'rxjs';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'lib-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent implements OnInit, OnDestroy {
  patients: Array<PatientAlertModel> = [];
  careTeam: Array<PhysicianModel> = [];
  show: boolean = true;
  private physician: PhysicianModel;
  private deleteNotificationSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toolbarService: ToolbarService,
    private notificationService: NotificationService,
    private swPush: SwPush
  ) {
    this.notificationService.notifications.subscribe((notification) => {
      if (notification && notification.recieverId === this.physician.id) {
        this.patients.map((patient) =>
          patient.id === notification.patientId
            ? this.onNotification(patient, notification)
            : (patient.link = `/caregiver/${this.physician.id}/patient/${patient.id}`)
        );
      }
    });

    this.deleteNotificationSubscription = this.toolbarService.deleteNotification.subscribe(
      (notification) => {
        this.patients.map((patient) =>
          patient.id === notification.patientId
            ? (patient.alertLevel = AlertLevel.Low)
            : patient
        );
      }
    );

    toolbarService.menuClick.subscribe(e => {
      this.show = !e.isOpen;
    })
  }

  ngOnDestroy(): void {
    this.deleteNotificationSubscription.unsubscribe();
   // this.notificationService.unsubscribe();
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      async (data: { model: CaregiverRouteDataModel }) => {
        this.patients = data.model.patients || [];
        this.physician = data.model.physician;
        this.setToolbar();
        this.patients.map(patient => {
          patient.link = `/caregiver/${this.physician.id}/patient/${patient.id}`
        })
        
        this.swPush.requestSubscription({
          serverPublicKey: 'BFzDE_amkbsU-zXrDw6lZC6xGrHGXQVEWhTrGOTTU2s_d9MzQG4bPTXNR6PfNGu2fcLIw8qQHLwXUplANAMGKaA' 
        }).then(async sub => {
          this.notificationService.addPushSubcriber(sub, this.physician.id).subscribe();
          await this.notificationService.subscribeAsync(this.physician.id, true)
        })
        .catch(async err => {
          await this.notificationService.subscribeAsync(this.physician.id);
        });
        
       // this.swPush.notificationClicks.subscribe(s => {
         // console.log(s.notification.title)
          
       // })
      }
    );
  }

  async onClick(patient: PatientAlertModel) {
    if (patient.alertLevel) {
      this.toolbarService.deleteNotification.next(patient.notification);
    }
    this.router.navigateByUrl(patient.link);
  }

  private setToolbar() {
    this.toolbarService.setToolbarData({
      title: 'Patient List',
      notificationReceiverId: this.physician.id,
    });
  }

  private onNotification(
    patient: PatientAlertModel,
    notification: Notification
  ) {
    patient.alertLevel = this.calculateAlertLevel(notification);
    patient.link = `/caregiver/${this.physician.id}/patient/${patient.id}/chat`;
    patient.notification = notification;
  }

  public calculateAlertLevel(notification: Notification): AlertLevel {
    if (!notification.isEscalation) {
      return AlertLevel.Medium;
    } else {
      return AlertLevel.High;
    }
  }
}

export class PatientAlertModel extends PatientModel {
  alertLevel?: AlertLevel;
  link?: string;
  notification?: Notification;
}

export enum AlertLevel {
  Low = 0,
  Medium = 1,
  High = 2,
}
