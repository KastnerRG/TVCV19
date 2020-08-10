import { Injectable } from '@angular/core';
import { LoginModel } from '../models/login.model';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private tokenName: string = 'jwtToken';

  constructor(private httpClient: HttpClient) { }

  getToken() {
    return localStorage.getItem(this.tokenName);
  }

  getRoles() {
    const helper = new JwtHelperService();
    const token = helper.decodeToken(this.getToken());
    let roles: string | Array<string> = token['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

    if (typeof roles === 'string') {
      return new Set([roles]);
    } else {
      return new Set(roles);
    }
  }

  getId() {
    const helper = new JwtHelperService();
    const token = helper.decodeToken(this.getToken());
    
    return parseInt(token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
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
        this.setToken(token);

        return token;
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenName);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenName, token);
  }
}
