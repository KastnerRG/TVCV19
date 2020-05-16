import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notifications = new Subject<Notification>();
  constructor(private http: HttpClient) {}

  async addNotification(notification: Notification) : Promise<void> {
    notification = await this.http
      .post<Notification>('/api/notification', notification)
      .pipe(catchError(this.handleError)).toPromise();
    this.notifications.next(notification);
  }

  async subscribeAsync(recieverId: string) : Promise<void> {
    const notifications = await this.get(recieverId).toPromise();
    for (const notification of notifications) {
      this.notifications.next(notification)
    }
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
  senderId?: string;
  recieverId?: string;
  patientId?: string;
  link?: string;
  message?: string;
  date?: Date;
}
