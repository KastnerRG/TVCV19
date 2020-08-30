import { Injectable } from '@angular/core';
import { LoginModel, AuthResult } from '../models/login.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  constructor(private httpClient: HttpClient) {}

  private setSession(authResult: AuthResult) {
    const expiresAt = new Date(authResult.expires)

    localStorage.setItem('token', authResult.token);
    localStorage.setItem('tokenExpiry', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
  }

  isLoggedIn() {
    let now = new Date();
    let tokentokenExpiry = this.getExpiration()
    return now <= tokentokenExpiry;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  login(loginModel: LoginModel) {
    return this.httpClient
      .post('/api/login', loginModel, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        map((res: AuthResult) => {
          this.setSession(res);
        })
      );
  }

  private getExpiration() {
    const expiration = localStorage.getItem('tokenExpiry');
    const expiresAt = JSON.parse(expiration);
    return expiresAt;
  }
}


