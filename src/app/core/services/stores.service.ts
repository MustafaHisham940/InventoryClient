import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../environment/environments';

@Injectable({
  providedIn: 'root'
})
export class StoresService {

  constructor(private _HttpClient:HttpClient) { }


  AddnewStore( newStoreData:any):Observable<any>{
  return  this._HttpClient.post(`${environments.baseURL}/api/StoreDef/AddNewStore` , newStoreData);  
 }

  UpdateStoreData(_id:string , updateStoreData:any):Observable<any>{
    return this._HttpClient.patch(`${environments.baseURL}/api/StoreDef/UpdateStore/${_id}` ,updateStoreData )
  }

  GetAllStoresFiltered(
    params:{
      _strCd?:string,
      _StrNm?:string,
      _PNam?:string,
      _Sort?:string,
      _pageIndex?:number,
      _pageSize?:number
     }
  ):Observable<any>{
    let httpParams = new HttpParams
    if(params._strCd ) httpParams= httpParams.append("_strCd" , params._strCd)
    if(params._StrNm) httpParams= httpParams.append("_StrNm" , params._StrNm)
    if(params._PNam) httpParams= httpParams.append("_PNam" , params._PNam)
    if(params._Sort) httpParams= httpParams.append("_Sort" , params._Sort)
    if(params._pageIndex!==undefined) httpParams=httpParams.append("_pageIndex" , params._pageIndex)
    if(params._pageSize!==undefined) httpParams=httpParams.append("_pageSize" , params._pageSize)

    return this._HttpClient.get(`${environments.baseURL}/api/StoreDef` ,{params:httpParams})
  }


  DeleteStore(_id:string  ):Observable<any>{
    return this._HttpClient.delete(`${environments.baseURL}/api/StoreDef/DeleteStore/${_id}`  )
  }

  /**top-selling store (highest sum(val) of Sales headers), its sales value, and the total store count */
  GetTopSellingStore(): Observable<any> {
    return this._HttpClient.get(`${environments.baseURL}/api/StoreDef/GetTopSellingStore`);
  }

  /**lightweight store code/name list for dropdowns */
  GetStoresLookupList(): Observable<any> {
    return this._HttpClient.get(`${environments.baseURL}/api/StoreDef/GetStoresLookupList`);
  }
}
