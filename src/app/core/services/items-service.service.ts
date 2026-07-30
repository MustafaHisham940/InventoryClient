import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../environment/environments';
import { ICreateItemDto } from '../interfaces/iitem';

@Injectable({
  providedIn: 'root'
})
export class ItemsServiceService {

  

  constructor(private _HttpClient:HttpClient) { }

 currentEditeItem:ICreateItemDto={
    id: '',
    itmNm:''
  

  }

  currentShowItem:ICreateItemDto={
    id: '',
    itmNm:''
  

  }


    
/**Get By ID */
    getItemById(idName: string): Observable<any> {
      return this._HttpClient.get(`${environments.baseURL}/api/Items/${idName}`);
    }


    /**get Filterd  */

    getFilteredItems(
      params:{
        _IdName?: string|null,
        _itmName?: string|null,
        _BarCode?: string|null,
        _CtgID?: string,
      
        Sort?: string,
      pageSize?: number ,
      pageIndex?: number 
     }
    ): Observable<any> {
      let httpParams = new HttpParams();
      // Build query parameters
    if (params._IdName) httpParams = httpParams.append('_IdName', params._IdName);
    if (params._itmName) httpParams = httpParams.append('_itmName', params._itmName);
    if (params._BarCode) httpParams = httpParams.append('_BarCode', params._BarCode);
    if (params._CtgID !== undefined) httpParams = httpParams.append('_CtgID', params._CtgID.toString());


    if (params.Sort) httpParams = httpParams.append('Sort', params.Sort);
    if (params.pageSize !== undefined) httpParams = httpParams.append('pageSize', params.pageSize.toString());
    if (params.pageIndex !== undefined) httpParams = httpParams.append('pageIndex', params.pageIndex.toString());
    
  
      return this._HttpClient.get(`${environments.baseURL}/api/Items/GetItemsWithFilter`, { params:httpParams });
    }



    getFilteredItemsExactMatch(
        _IdName?: string|null,        
    ): Observable<any> {
    
      // Build query parameters     
      return this._HttpClient.get(`${environments.baseURL}/api/Items/GetItemByIdExactMatch/${_IdName}`);
    }

    /* inset new item*/

    addNewItem(newItem: any): Observable<any> {
      return this._HttpClient.post(`${environments.baseURL}/api/Items/insertNewItem`, newItem);
    }

    /**UPdate item */
    updateItem(itemId: string, updatedData: any): Observable<any> {
      return this._HttpClient.patch(`${environments.baseURL}/api/Items/UpdateITem/${itemId}`, updatedData);
    }

    /**delete ITem */
    deleteItem(itemId: string): Observable<any> {
      return this._HttpClient.delete(`${environments.baseURL}/api/Items/${itemId}`);
    }
}
