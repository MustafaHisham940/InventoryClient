import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../environment/environments';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private _HttpClient:HttpClient) { }



  getFilteredICtgs(
    params:{
      catigoryID?: number,
      catigoryName?: string,
      sort?: string,
      PageSize?: number ,
      PageIndex?: number 
   }
  ): Observable<any> {
    let httpParams = new HttpParams();
    // Build query parameters
  if (params.catigoryID !== undefined) httpParams = httpParams.append('catigoryID', params.catigoryID.toString());
  if (params.catigoryName) httpParams = httpParams.append('catigoryName', params.catigoryName);


  if (params.sort) httpParams = httpParams.append('sort', params.sort);
  if (params.PageSize !== undefined) httpParams = httpParams.append('PageSize', params.PageSize.toString());
  if (params.PageIndex !== undefined) httpParams = httpParams.append('PageIndex', params.PageIndex.toString());
  

    return this._HttpClient.get(`${environments.baseURL}/api/Ctg/GetAllCategories`, { params:httpParams });
  }

  addNewCtg(newItem: any): Observable<any> {
    return this._HttpClient.post(`${environments.baseURL}/api/Ctg/CreateNewCatigory`, newItem);
  }

   /**UPdate item */
   updateCtg(ctg_id: number, updatedData: any): Observable<any> {
    return this._HttpClient.patch(`${environments.baseURL}/api/Ctg/UpdateCategoryName/${ctg_id}`, updatedData);
  }
  /**delete ITem */
  deleteItem(ctg_id: number): Observable<any> {
    return this._HttpClient.delete(`${environments.baseURL}/api/Ctg/DeleteCategory/${ctg_id}`);
  }
  
}
