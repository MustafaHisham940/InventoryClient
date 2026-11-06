import { Injectable } from '@angular/core';

import { HttpClient ,HttpParams } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { environments } from '../environment/environments';
import { ICreateCustomerDto } from '../interfaces/icustomer';
 
@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  constructor(private _HttpClient:HttpClient) { }

  currentEditeCustomer:ICreateCustomerDto={
    id: -1,
    cstNm: ''
  

  }

  currentShowCustomer:ICreateCustomerDto={
    id: -1,
    cstNm: ''
  

  }

  GetAllCustomers():Observable<any>{
    return this._HttpClient.get(`${environments.baseURL}/api/Customers`)
  }

  getAllCustomers(params: {
    Id?: number,
    Gov?: number,
    Mrkz?: number,
    Address?: string,
    Type?: string,
    Pst?: string,
    Sort?: string,
    Name?: string,
    pageIndex?:number,
    pageSize?:number

  }): Observable<any> {
    // Create HttpParams object to handle query parameters
    let httpParams = new HttpParams();

    // Add parameters only if they are provided
    if (params.Id !== undefined) httpParams = httpParams.append('Id', params.Id.toString());
    if (params.Gov !== undefined) httpParams = httpParams.append('Gov', params.Gov.toString());
    if (params.Mrkz !== undefined) httpParams = httpParams.append('Mrkz', params.Mrkz.toString());
    if (params.Address) httpParams = httpParams.append('Address', params.Address);
    if (params.Type !== undefined) httpParams = httpParams.append('Type', params.Type.toString());
    if (params.Pst !== undefined) httpParams = httpParams.append('Pst', params.Pst.toString());
    if (params.Sort) httpParams = httpParams.append('Sort', params.Sort);
    if (params.Name) httpParams = httpParams.append('Name', params.Name);
    if (params.pageIndex!== undefined) httpParams = httpParams.append('pageIndex', params.pageIndex.toString());
    if (params.pageSize!== undefined) httpParams = httpParams.append('pageSize', params.pageSize.toString());

    return this._HttpClient.get(`${environments.baseURL}/api/Customers`, {
      params: httpParams
    });
  }



   // Create new customer
   createCustomer(customerData: object): Observable<any> {
    

    return this._HttpClient.post(
      `${environments.baseURL}/api/Customers/insertCustomer`,
      customerData
     
    );

   
  }



  getCustomerById(id:number):Observable<any>{

    return this._HttpClient.get(`${environments.baseURL}/api/Customers/${id}`)

  }

  updateCustomer(id: number, customerData: any):Observable<any> {
    return this._HttpClient.patch(`${environments.baseURL}/api/Customers/${id}`, customerData);
  }
  deleteCustomer(id: number):Observable<any> {
    return this._HttpClient.delete(`${environments.baseURL}/api/Customers/${id}`);
  }


  getTotalCounts():Observable<any>{
     
      return this._HttpClient.get(`${environments.baseURL}/api/Customers/GetTotalCount`)

  }

  /**exact match by code - CustomerName, CustomerCode, CustomerType only */
  getCustomerExactMatchById(id: string | number): Observable<any> {
    return this._HttpClient.get(`${environments.baseURL}/api/Customers/GetCustomerExactMatchById/${id}`);
  }

}
