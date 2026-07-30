import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../environment/environments';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingsService {

  constructor(private _HttpClient:HttpClient) { }

  GetSystemServices(): Observable<any> {
    return this._HttpClient.get(`${environments.baseURL}/api/Settings`);
  }




}
