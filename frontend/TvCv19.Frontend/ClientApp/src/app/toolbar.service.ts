import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  Notification,
  NotificationService,
} from 'projects/shared-caregiver/src/lib/notification.service';
import { HierarchyLevel, PatientModel, PhysicianModel } from 'projects/shared/src/public-api';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  toolBarData = new Subject<ToolBarData>();

  deleteNotification: Subject<Notification> = new Subject<Notification>();

  constructor(private notificationService: NotificationService) {
    this.deleteNotification.subscribe(async n => {
      this.notificationService.delete(n.id).toPromise();
    })
   }
 
  setToolbarData(data: ToolBarData) {
        this.toolBarData.next(data);
  }
}

export interface ToolBarData {
  title?: string;
  menu?: Array<MenuLinks>;
  back?: boolean;
  notificationReceiverId?: string;
  escalation?: Escalation
}

export interface MenuLinks {
  link: string;
  title: string;
}

export interface Message {
  link?: string;
}

export interface Escalation {
  patient: PatientModel
  physician: PhysicianModel
}
