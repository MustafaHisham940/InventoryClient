import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../environment/environments';

@Injectable({
  providedIn: 'root'
})
export class ItemBalanceServiceService {

  constructor(private _HttpClient:HttpClient) { }



  GetAllBalancesFiltered(
    params: {
      _BCd?: string;
      _ItmCd?: string;
      _BBal?: number;
      _IQty?: number;
      _OQty?: number;
      _ROrdr?: number;
      _Cst?: number;
      _sort?: string;
      _pageSize: number;
      _pageIndex: number;
    }
  ): Observable<any> {
    let httpParams = new HttpParams();

    if (params._BCd) httpParams = httpParams.append("_BCd", params._BCd);
    if (params._ItmCd) httpParams = httpParams.append("_ItmCd", params._ItmCd);
    if (params._BBal !== undefined) httpParams = httpParams.append("_BBal", params._BBal.toString());
    if (params._IQty !== undefined) httpParams = httpParams.append("_IQty", params._IQty.toString());
    if (params._OQty !== undefined) httpParams = httpParams.append("_OQty", params._OQty.toString());
    if (params._ROrdr !== undefined) httpParams = httpParams.append("_ROrdr`", params._ROrdr.toString());
    if (params._Cst !== undefined) httpParams = httpParams.append("_Cst", params._Cst.toString());
    if (params._sort) httpParams = httpParams.append("_sort", params._sort);
    if (params._pageSize !== undefined) httpParams = httpParams.append("_pageSize", params._pageSize.toString());
    if (params._pageIndex !== undefined) httpParams = httpParams.append("_pageIndex", params._pageIndex.toString());

    return this._HttpClient.get(`${environments.baseURL}/api/ItemBalance/GetAllBalancesFiltered`, { params: httpParams });}


   

    AddNewBalance(newBalance:any  ):Observable<any>{
      return this._HttpClient.post(`${environments.baseURL}/api/ItemBalance/AddItemBalance` ,newBalance )
    }

    updateItemBalance(
      paramss:{
        _BCd?:string,
        _ItmCd?:string
      }
      ,newBalance:any):Observable<any>{
        let httpParams= new HttpParams()
        if(paramss._BCd)httpParams= httpParams.append("_BCd",paramss._BCd)
        if(paramss._ItmCd)httpParams= httpParams.append("_ItmCd",paramss._ItmCd)

      return this._HttpClient.patch(`${environments.baseURL}/api/ItemBalance/updateITemBalance` ,newBalance,{params:httpParams} )
    }


    DeleteBalance(
      
        _BCd:string,
        _ItmCd:string
     
      ):Observable<any>{
        let httpParams = new HttpParams()
        if(_BCd)httpParams=httpParams.append("_BCd" , _BCd)
        if(_ItmCd)httpParams=httpParams.append("_ItmCd" , _ItmCd)
          console.log("_BCd = ", _BCd ,"_ItmCd =" ,_ItmCd  )
      return this._HttpClient.delete(`${environments.baseURL}/api/ItemBalance/deleteITemBal` , {params:httpParams}  )
    }

    /**name of the item with the highest total OQty */
    getMostBoughtItem(): Observable<any> {
      return this._HttpClient.get(`${environments.baseURL}/api/ItemBalance/GetMostBoughtItem`);
    }

    /**item with the highest IQty in a specific store */
    getTopItemByIQty(_BCd: string): Observable<any> {
      let httpParams = new HttpParams().append("_BCd", _BCd);
      return this._HttpClient.get(`${environments.baseURL}/api/ItemBalance/GetTopItemByIQty`, { params: httpParams });
    }

}
