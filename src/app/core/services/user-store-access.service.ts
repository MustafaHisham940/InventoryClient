import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../environment/environments';

/** which stores a user works with: every store, or exactly one */
export interface UserStoreAccess {
  userName: string;
  multiStore: boolean;
  /** null when multiStore is true */
  singleStoreCode: string | null;
  singleStoreName: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserStoreAccessService {

  private readonly base = `${environments.baseURL}/api/UserStoreAccess`;

  constructor(private _HttpClient: HttpClient) { }

  getAccess(userName: string): Observable<{ data: UserStoreAccess }> {
    return this._HttpClient.get<{ data: UserStoreAccess }>(`${this.base}/${encodeURIComponent(userName)}`);
  }

  /** multiStore = true -> every store (the code is ignored); false -> only the given store */
  setAccess(userName: string, multiStore: boolean, singleStoreCode: string | null): Observable<any> {
    return this._HttpClient.put<any>(`${this.base}/${encodeURIComponent(userName)}`, { multiStore, singleStoreCode });
  }
}
