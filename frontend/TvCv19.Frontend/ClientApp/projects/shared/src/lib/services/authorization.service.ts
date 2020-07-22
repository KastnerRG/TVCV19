import { Injectable } from '@angular/core';
import { LoginModel, LoginResult } from '../models/login.model';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private tokenName: string = 'jwtToken';

  constructor(private httpClient: HttpClient) { }

  getToken() {
    return localStorage.getItem(this.tokenName);
  }

  isSignedIn() {
    return this.httpClient.get('/api/login')
      .pipe(
        catchError(e => of(false)),
        map(data => data as boolean)
      );
  }

  login(loginModel: LoginModel) {
    return this.httpClient.post('/api/login', loginModel, {
      responseType: 'text'
    }).pipe(
      map(token => {
        localStorage.setItem(this.tokenName, token);

        return token;
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenName);
  }
}
