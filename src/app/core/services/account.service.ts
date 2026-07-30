import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../environment/environments';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private _HttpClient:HttpClient) { }

  login(_username:string , _id:string): Observable<any> {

    var loginDto:Object={
      "userName": _username,
      "password": _id
    }
    return this._HttpClient.post(`${environments.baseURL}/api/Accounts/login`, loginDto);
  }




  registerUser(payload: any): Observable<any> {
    return this._HttpClient.post(`${environments.baseURL}/api/Accounts/register`, payload);
  }






  getAllUsers(): Observable<any> {
    return this._HttpClient.get<any>(`${environments.baseURL}/api/Accounts/GetAllUsers`);
  }

  getAllRoles():Observable<any>{
    return this._HttpClient.get<any>(`${environments.baseURL}/api/Accounts/GetAllRoles`);
  }


  updateUserRoles(_id: string, _newRoles: string[]): Observable<any> {
    const params = new HttpParams().set('_id', _id);
    return this._HttpClient.patch<any>(
      `${environments.baseURL}/api/Accounts/UpdateUserRoles`,
      _newRoles,
      { params }
    );
  }


  getUserRolesById(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this._HttpClient.get<any>(
      `${environments.baseURL}/api/Accounts/GetUserRolesbyId`,
     
      { params }
    );
  }



  getUserByID(_userName:string): Observable<any> {  
    return this._HttpClient.get<any>(`${environments.baseURL}/api/Accounts/GetUserData?_userName=${encodeURIComponent(_userName)}`);
  }


  updateUserData(username: string, payload: any): Observable<any> {
    const url = `${environments.baseURL}/api/Accounts/UpdateUserData?_username=${encodeURIComponent(username)}`;
    return this._HttpClient.patch(url, payload);
  }




  resetPassword(payload: any): Observable<any> {
    return this._HttpClient.post(`${environments.baseURL}/api/Accounts/reset-password`, payload);
  }

  toggleUserStatus(username: string): Observable<any> {
    return this._HttpClient.post<any>(
      `${environments.baseURL}/api/Accounts/ToggleUserStatus`,
      null, // No body needed since you're using query params
      {
        params: { _Username: username }
      }
    );
  }



  
  getAllUsersCounts(): Observable<any> {
    return this._HttpClient.get<any>(`${environments.baseURL}/api/Accounts/GetUserTotal`);
  }


  
}
