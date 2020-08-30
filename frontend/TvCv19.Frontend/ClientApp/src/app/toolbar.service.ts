import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  Notification,
  NotificationService,
} from 'projects/caregiver/src/lib/notification.service';
import { HierarchyLevel, PatientModel, PhysicianModel } from 'projects/shared/src/public-api';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  private isOpen: boolean; 
  toolBarData = new Subject<ToolBarData>();
  deleteNotification: Subject<Notification> = new Subject<Notification>();
  menuClick: Subject<MenuState> = new Subject<MenuState>(); 

  constructor(private notificationService: NotificationService) {
    this.deleteNotification.subscribe(async n => {
      this.notificationService.delete(n.id).toPromise();
    })
   }
 
  setToolbarData(data: ToolBarData) {
        this.toolBarData.next(data);
  }

  onMenuClick() {
    this.isOpen = !this.isOpen;
    this.menuClick.next({isOpen: this.isOpen})
  }
}

export interface ToolBarData {
  title?: string;
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

export interface MenuState {
  isOpen: boolean
}
