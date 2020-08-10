import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, throwError, Observable, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notifications = new Subject<Notification>();
  private chatserviceSubscription: Array<Subscription> = [];
  constructor(private http: HttpClient) {}

  unsubscribe() {
    this.chatserviceSubscription.forEach((s) => s.unsubscribe());
  }
  async subscribeAsync(recieverId: number): Promise<void> {
    // todo remove and get from service 
    // get all unread notifications every second
    setInterval(() => {
      this.get(recieverId).subscribe((notifications) => {
        for (const notification of notifications) {
          this.notifications.next(notification);
        }
      });
    }, 1000);
  }

  private get(recieverId: number): Observable<Array<Notification>> {
    return this.http
      .get<Array<Notification>>(`/api/notification/${recieverId}`)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
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
  id?: number;
  recieverId?: number;
  patientId?: number;
  link?: string;
  message?: string;
  date?: Date;
  isEscalation?: boolean;
}
