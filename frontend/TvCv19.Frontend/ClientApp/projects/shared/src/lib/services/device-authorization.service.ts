import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnectionBuilder, LogLevel, HubConnection, HubConnectionState } from '@microsoft/signalr';
import { AuthorizationService } from './authorization.service';

interface EndRegisterPatientDeviceModel
{
    connectionId: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceAuthorizationService {
  private connection: HubConnection;

  constructor(private httpClient: HttpClient, authorizationService: AuthorizationService) {
    this.connection = new HubConnectionBuilder()
      .withUrl('/hubs/device-authorization')
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.on('LoginPatientDevice', token => {
      authorizationService.setToken(token);

      location.href = '/';
    });
  }

  beginRegisterPatientDevice() {
    return this.httpClient.post('/api/device/patient', {}, {
      responseType: 'text'
    });
  }

  async connectAsync() {
    if (this.connection.state !== HubConnectionState.Connected) {
      await this.connection.start();
    }
  }

  endRegisterPatientDevice(token: string, model: EndRegisterPatientDeviceModel) {
    return this.httpClient.put(`/api/device/patient/${token}`, model);
  }

  async getConnectionIdAsync() {
    await this.connectAsync();

    return this.connection.connectionId;
  }
}
