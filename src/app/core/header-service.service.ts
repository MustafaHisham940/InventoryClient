import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from './environment/environments';
import { IVDtlsspecsFilter } from './interfaces/ivDtls';
import { DeleteAllHeadersObj } from './interfaces/HdrData';

@Injectable({
  providedIn: 'root'
})
export class HeaderServiceService {

  constructor(private http: HttpClient) {}


  getAllDetailsFiltered(inputSpecs: any): Observable<any> {
    return this.http.post<any>(`${environments.baseURL}/api/DetailsContoller/GetAllDetailsFitered`, inputSpecs);
  }
  
  
  AddNewDetails(inputSpecs: any): Observable<any> {
    return this.http.post<any>(`${environments.baseURL}/api/DetailsContoller/AddNewDetails`, inputSpecs);
  }
  

  EditeDetailsData(updateData:any,StrCd:string , TrsTy:number ,TrsNo:number ,LnNo:number ):Observable<any>{
    
    return this.http.patch<any>(`${environments.baseURL}/api/DetailsContoller/updateDeatilsNewTech/${StrCd}/${TrsTy}/${TrsNo}/${LnNo}` , updateData);
  }

  EditeHeadersData(updateData:any,StrCd:string , TrsTy:number ,TrsNo:number  ):Observable<any>{

    return this.http.patch<any>(`${environments.baseURL}/api/Headers/UpdateHeader/${StrCd}/${TrsTy}/${TrsNo}` , updateData);
  }

  // For headers with no related store (StrCd is null), e.g. ClientPayments.
  EditeHeadersDataNoStore(updateData:any , TrsTy:number ,TrsNo:number  ):Observable<any>{

    return this.http.patch<any>(`${environments.baseURL}/api/Headers/UpdateHeaderNoStore/${TrsTy}/${TrsNo}` , updateData);
  }

  DeleteHeaderData(StrCd:string , TrsTy:number ,TrsNo:number  ):Observable<any>{
    
    return this.http.delete<any>(`${environments.baseURL}/api/Headers/DeleteHeaders/${StrCd}/${TrsTy}/${TrsNo}`);
  }

  DeleteDetailsdata(StrCd:string , TrsTy:number ,TrsNo:number ,LnNo:number  ):Observable<any>{
    
    return this.http.delete<any>(`${environments.baseURL}/api/DetailsContoller/DeleteDetails/${StrCd}/${TrsTy}/${TrsNo}/${LnNo}`);
  }


  getMaxDtlsLno(data: any): Observable<any> {
    return this.http.post<number>(
      `${environments.baseURL}/api/DetailsContoller/GetMaxDtlsLno`,
      data
    );
  }



  deleteHeadersParallel(data: any ): Observable<any> {
    return this.http.post<any>(`${environments.baseURL}/api/DeleteHeaders/DeleteHeadersParallel`
      ,  data );
  }

  

  deleteHeadersParallels(data: any) {
    return this.http.post<any>('http://localhost:7233/api/DeleteHeaders/DeleteHeadersParallel', data);
  }
}
