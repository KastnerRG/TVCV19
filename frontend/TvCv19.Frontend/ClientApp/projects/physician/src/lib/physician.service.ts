import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface PhysicianModel {
  id: string;
  Name: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhysicianService {

  constructor(private httpClient: HttpClient) { }

  addPhysician(physician: PhysicianModel): Observable<string> {
    return this.httpClient.post('api/physician', physician).pipe(map(id => id as string));
  }

  deletePhysician(id: string): Observable<any> {
    return this.httpClient.delete(`api/physician/${id}`);
  }

  getPhysicians(): Observable<PhysicianModel[]> {
    return this.httpClient.get('api/physician').pipe(map(p => p as PhysicianModel[]));
  }

  getPhysician(id: string): Observable<PhysicianModel> {
    return this.httpClient.get(`api/physician/${id}`).pipe(map(p => p as PhysicianModel));
  }

  updatePhysician(physician: PhysicianModel): Observable<any> {
    return this.httpClient.put(`api/physician/${physician.id}`, physician);
  }

}
