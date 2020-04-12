import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { PhysicianModel } from '../models/physician.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PhysicianService {
  constructor(private http: HttpClient) {}

  addPhysician(body: PhysicianModel): Observable<PhysicianModel> {
    return this.http
      .post<PhysicianModel>('/api/physician', body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getPhysicians(): Observable<Array<PhysicianModel>> {
    return this.http.get<Array<PhysicianModel>>('/api/physician', {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    })
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
