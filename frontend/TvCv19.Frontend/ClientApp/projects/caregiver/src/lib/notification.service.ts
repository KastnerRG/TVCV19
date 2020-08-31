import { Injectable, OnDestroy } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Subject, throwError, Observable, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChatService } from './chat.service';
import {
  PhysicianService,
  PatientService,
} from 'projects/shared/src/public-api';
import { SwPush } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notifications = new Subject<Notification>();
  recieverId: string;
  constructor(
    private http: HttpClient,
    private swPush: SwPush
  ) { 
     this.swPush.notificationClicks.subscribe(n => {
      console.log(n.notification) 
      this.delete(n.notification.data.id);
     })
  }
  async addNotification(notification: Notification): Promise<void> {
    notification = await this.http
      .post<Notification>('/api/notification', notification)
      .pipe(catchError(this.handleError))
      .toPromise();
    this.notifications.next(notification);
  }

  async subscribeAsync(recieverId: string, hasPush: boolean = false): Promise<void> {
    // get all unread notifications
    this.recieverId = recieverId;
    if(!hasPush) {
      setInterval(() => {
        this.get(recieverId).toPromise().then(notifications => {
          for (const notification of notifications) {
            this.notifications.next(notification);
          }
        });
      }, 5000)
    } else {
      this.get(recieverId).toPromise().then(notifications => {
        for (const notification of notifications) {
          this.notifications.next(notification);
        }
      });
    }
  }

  addPushSubcriber(sub: PushSubscription, recieverId): Observable<any> {
    console.log(sub.toJSON());
    return this.http
      .post(`/api/notification/${recieverId}/push`, sub.toJSON(), {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }

  private get(recieverId: string): Observable<Array<Notification>> {
    return this.http
      .get<Array<Notification>>(`/api/notification/${recieverId}`)
      .pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<any> {
    return this.http
      .delete<string>(`/api/notification/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}

export interface Notification {
  id?: string;
  recieverId?: string;
  patientId?: string;
  link?: string;
  message?: string;
  date?: Date;
  isEscalation?: boolean;
}
