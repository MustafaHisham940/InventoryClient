import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { StoreTokenSettings } from '../interfaces/StoreTokenSettings';

export interface JwtPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress':string
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string[];
  'IsActive':string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname':string;
  'SingleStoreCode':string;
  'MultiStore':string;
  'SingleStoreName':string;
  'AcceptMinus':string;
  /** configurable user roles (admin / manager / cashier ...): one claim, or an array when the user holds several */
  'UserRole'?: string | string[];

}
 

 

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  getRoles(): string[] | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? null;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }



  /** names of the configurable roles (admin / manager / cashier ...) the user holds */
  getUserRoles(): string[] {
    const token = sessionStorage.getItem('token');
    if (!token) return [];

    try {
      const claim = jwtDecode<JwtPayload>(token)['UserRole'];
      return claim === undefined ? [] : Array.isArray(claim) ? claim : [claim];
    } catch (err) {
      console.error('Error decoding token:', err);
      return [];
    }
  }

  getusername(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
  
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? null;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }


  geteMAIL(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
  
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? null;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }

  getGivenName(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
  
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] ?? null;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }


  GetUserStoreSettings(): StoreTokenSettings | null {
    const token = sessionStorage.getItem('token');
    let StoreSerrings:StoreTokenSettings={
      MultiStore: '',
      SingleStoreCode: '',
      SingleStoreName: '',
      AcceptMinus: ''
    }
    if (!token) return null;
  
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      StoreSerrings.MultiStore=decoded['MultiStore'] ?? null;
      StoreSerrings.SingleStoreCode=decoded['SingleStoreCode'] ?? null;
      StoreSerrings.SingleStoreName=decoded['SingleStoreName'] ?? null;
      StoreSerrings.AcceptMinus=decoded['AcceptMinus'] ?? null;

      return StoreSerrings;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }




  GetUSerStatus(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
  
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('tokeeeeeeeeeeeeen is active ' +decoded['IsActive'] )
      return decoded['IsActive'] ?? null;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }
}
