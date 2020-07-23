import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ApplicationLogin {
  id?: string;
  enabled?: boolean;
  normalizedUserName?: string;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private httpClient: HttpClient) { }

  createApplicationLogin(applicationLogin: ApplicationLogin, password: string) {
    if (!applicationLogin.enabled) {
      applicationLogin.enabled = true;
    }

    return this.httpClient.post<ApplicationLogin>('/api/application-login', {
      applicationLogin: applicationLogin,
      password: password
    });
  }

  getApplicationLogins() {
    return this.httpClient.get<ApplicationLogin[]>('/api/application-login');
  }

  updateApplicationLogin(applicationLogin: ApplicationLogin) {
    return this.httpClient.put(`/api/application-login/${applicationLogin.id}`, applicationLogin);
  }

  setPasswordLogin(id: string, password: string) {
    return this.httpClient.put(`/api/application-login/${id}/password`, {
      password: password
    });
  }
}
