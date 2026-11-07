import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../environment/environments';

export interface UserRole {
  id: number;
  name: string;
  isSuperAdmin: boolean;
  /** given to every newly registered user */
  isDefault: boolean;
  pagesCount: number;
  usersCount: number;
}

export interface UserAccess {
  roles: string[];
  /** page keys the user may open; ['*'] = every page */
  pages: string[];
}

/** Configurable roles (admin / manager / cashier ...), their pages and the roles of each user. */
@Injectable({
  providedIn: 'root'
})
export class UserRolesService {

  private readonly base = `${environments.baseURL}/api/UserRoles`;

  constructor(private _HttpClient: HttpClient) { }

  getRoles(): Observable<{ data: UserRole[], count: number }> {
    return this._HttpClient.get<{ data: UserRole[], count: number }>(this.base);
  }

  createRole(name: string, isSuperAdmin: boolean, isDefault: boolean): Observable<any> {
    return this._HttpClient.post<any>(this.base, { name, isSuperAdmin, isDefault });
  }

  updateRole(id: number, name: string, isSuperAdmin: boolean, isDefault: boolean): Observable<any> {
    return this._HttpClient.put<any>(`${this.base}/${id}`, { name, isSuperAdmin, isDefault });
  }

  deleteRole(id: number): Observable<any> {
    return this._HttpClient.delete<any>(`${this.base}/${id}`);
  }

  getRolePages(id: number): Observable<{ data: string[] }> {
    return this._HttpClient.get<{ data: string[] }>(`${this.base}/${id}/pages`);
  }

  setRolePages(id: number, pageKeys: string[]): Observable<any> {
    return this._HttpClient.put<any>(`${this.base}/${id}/pages`, pageKeys);
  }

  getUserRoleIds(userName: string): Observable<{ data: number[] }> {
    return this._HttpClient.get<{ data: number[] }>(`${this.base}/ByUser/${encodeURIComponent(userName)}`);
  }

  setUserRoles(userName: string, roleIds: number[]): Observable<any> {
    return this._HttpClient.put<any>(`${this.base}/ByUser/${encodeURIComponent(userName)}`, roleIds);
  }

  getUserAccess(userName: string): Observable<{ data: UserAccess }> {
    return this._HttpClient.get<{ data: UserAccess }>(`${this.base}/AccessByUser/${encodeURIComponent(userName)}`);
  }
}
