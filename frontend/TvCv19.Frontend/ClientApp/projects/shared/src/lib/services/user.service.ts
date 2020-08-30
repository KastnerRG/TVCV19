import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { AuthorizationService } from './authorization.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authorizationService: AuthorizationService) { }
  
  getUser() : User {
    let token = this.authorizationService.getToken();
    let decoded = jwt_decode(token);
    console.log(decoded);
    return { name: decoded["name"], role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"], id: decoded.sub}
  }

}

export interface User { 
  id: string,
  name: string,
  role: Role
}

export enum Role {
  Patient = "Patient", Caregiver = "Caregiver", Admin = "Administrator"
}