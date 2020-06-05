import { Component, OnInit } from '@angular/core';
import { ToolbarService, ToolBarData } from '../toolbar.service';
import { Location } from '@angular/common';
import { Notification, NotificationService } from 'projects/shared-caregiver/src/lib/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.scss'],
})
export class AppToolbarComponent implements OnInit {
  data: ToolBarData;
  notifications: Array<Notification> = [];
  constructor(public toolbarService: ToolbarService, private location: Location, private router: Router, private notificationService: NotificationService) {
    this.toolbarService.toolBarData.subscribe((d) => {
      this.data = d
    });

    this.toolbarService.deleteNotification.subscribe(notification => this.removeNotification(notification))
    
    notificationService.notifications.subscribe(async notification => {
      if(notification) {
        // dont add a notification if in the same page as link
        //dont add any notifications with the same link twice  
        if(this.location.path() !== notification.link && this.notifications.filter(x => x.link === notification.link).length === 0) {
           this.notifications.push(notification)
        } else {
           await this.notificationService.delete(notification.id).toPromise()
        }
      }
    })
  }

  ngOnInit(): void { }

  back() {
    this.location.back();
  }

  async noticationClick() {
    if(this.notifications.length > 0){
      const notification = this.notifications[this.notifications.length - 1]
      await this.notificationService.delete(notification.id).toPromise()
      this.toolbarService.deleteNotification.next(notification)
      this.router.navigateByUrl(notification.link)
    }
  }

  private removeNotification(notification: Notification){
    if(notification) {
      this.notifications.splice(this.notifications.indexOf(notification), 1)
    }
  }


}
