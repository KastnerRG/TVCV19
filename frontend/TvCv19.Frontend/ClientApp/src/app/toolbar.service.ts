import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  Notification,
  NotificationService,
} from 'projects/shared-caregiver/src/lib/notification.service';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  visible: boolean;

  constructor() { this.visible = true; }

  hide() { this.visible = false; }
  show() { this.visible = true; }

  toolBarData = new BehaviorSubject<ToolBarData>({
    title: ''
  });

  deleteNotification: Subject<Notification> = new Subject<Notification>();
 
  setToolbarData(data: ToolBarData): void {
    this.toolBarData.next(data);
  }
}

export interface ToolBarData {
  title?: string;
  menu?: Array<MenuLinks>;
  back?: boolean;

}
export interface MenuLinks {
  link: string;
  title: string;
}

export interface Message {
  link?: string;
}
