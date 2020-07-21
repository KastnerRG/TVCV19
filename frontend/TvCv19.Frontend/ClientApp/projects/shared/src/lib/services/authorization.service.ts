import { Injectable } from '@angular/core';
import { LoginModel, LoginResult } from '../models/login.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private httpClient: HttpClient) { }

  isSignedIn() {
    return this.httpClient.get('/api/login')
      .pipe(
        map(data => data as boolean)
      );
  }

  login(loginModel: LoginModel) {
    return this.httpClient.post('/api/login', loginModel)
      .pipe(
        map(data => data as LoginResult)
      );
  }

  logout() {
    return this.httpClient.post('/api/logout', {});
  }
}
