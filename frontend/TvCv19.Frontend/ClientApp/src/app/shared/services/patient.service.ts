import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { PatientModel } from '../models/patient-model';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PatientService {
  constructor(private http: HttpClient) { }

  getPatientsByPhysicianId(id: string): Observable<Array<PatientModel>> {
    return this.http.get<Array<PatientModel>>(`/api/patient/physician/${id}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  admitPatient(body: PatientModel): Observable<PatientModel> {
    return this.http.post<PatientModel>('/api/patient', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })

    })
      .pipe(
        catchError(this.handleError)
      );
  }
  updatePatient(body: PatientModel): Observable<PatientModel> {
    return this.http.put<PatientModel>('/api/patient', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })

    })
      .pipe(
        catchError(this.handleError)
      );
  }
  getPatient(id: string): Observable<PatientModel> {
    return this.http.get<PatientModel>(`/api/patient/${id}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
