import { Component, OnInit } from '@angular/core';
import { ToolbarService, ToolBarData } from '../toolbar.service';
import { Location } from '@angular/common';
import {
  Notification,
  NotificationService,
} from 'projects/caregiver/src/lib/notification.service';
import { Router } from '@angular/router';
import {
  EscalatePatientDialog,
  EscalationData,
} from '../escalate-patient/escalate-patient.dialog';
import { MatDialog } from '@angular/material/dialog';
import { PatientService, HierarchyLevel, AuthorizationService } from 'projects/shared/src/public-api';
import { ChatService } from 'projects/caregiver/src/lib/chat.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.scss'],
})
export class AppToolbarComponent implements OnInit {
  data: ToolBarData;

  notification: Notification;
  constructor(
    private toolbarService: ToolbarService,
    private location: Location,
    private dialog: MatDialog,
    private router: Router,
    private notificationService: NotificationService,
    private patientService: PatientService,
    private chatService: ChatService,
    private authorizationService: AuthorizationService
  ) {
    this.toolbarService.toolBarData.subscribe(async (d) => {
      this.data = d;
      if (this.data.notificationReceiverId) {
        await this.notificationService.subscribeAsync(
          this.data.notificationReceiverId
        );
      }
    });
    
  }

  openMenu() {
    this.toolbarService.onMenuClick();
  }

  isEscalate(): boolean {
    switch (this.data.escalation.physician.hierarchy) {
      case HierarchyLevel.FirstLine:
        return this.data.escalation.patient.escalationLevel < 1;
      case HierarchyLevel.SecondLine:
        return this.data.escalation.patient.escalationLevel < 2;
      default:
        return false;
    }
  }

  ngOnInit(): void {
    this.notificationService.notifications.subscribe(async (notification) => {
      if (
        notification &&
        notification.recieverId === this.data.notificationReceiverId
      ) {
        // only add new notifications
        this.notification = notification;
      }
    });
    this.toolbarService.deleteNotification.subscribe((notification) =>
      this.notification = undefined
    );
  }

  back() {
    this.toolbarService.setToolbarData({ title: '' });
    this.location.back();
  }

  async escalate() {
    const isEscalate = this.isEscalate();
    const dialogRef = this.dialog.open(EscalatePatientDialog, {
      width: '80vw',
      data: {
        message: '',
        isEscalation: isEscalate,
        title: isEscalate ? 'Escalate' : 'De Escalate',
        placeholder: isEscalate
          ? 'Reason patient needs to be escalated'
          : 'Reason patient needs to be de escalated',
      },
    });

    dialogRef.afterClosed().subscribe(async (result: EscalationData) => {
      if (result) {
        if (isEscalate) {
          switch (this.data.escalation.physician.hierarchy) {
            case HierarchyLevel.FirstLine:
              this.data.escalation.patient.escalationLevel = 1;
            case HierarchyLevel.SecondLine:
              this.data.escalation.patient.escalationLevel = 2;
          }
        } else {
          this.data.escalation.patient.escalationLevel = 0;
        }
        await this.patientService
          .updatePatient(this.data.escalation.patient)
          .toPromise();

        await this.chatService.sendMessageAsync(
          this.data.escalation.patient.id,
          this.data.escalation.physician.id,
          result.message,
          undefined,
          false,
          false,
          false,
          isEscalate
        );
      }
    });
  }

  async noticationClick() {
      await this.notificationService.delete(this.notification.id).toPromise();
      var link = this.notification.link;
      this.notification = undefined;
      this.toolbarService.deleteNotification.next(this.notification);
      this.router.navigateByUrl(link);
  }

  logout() {
    this.authorizationService.logout();

    location.href = '/';
  }
}
