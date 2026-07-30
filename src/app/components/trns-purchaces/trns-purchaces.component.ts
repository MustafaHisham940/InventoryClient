import { Component, OnInit, Output, output, signal } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { TransactionMap,TransactionObj } from '../../core/interfaces/transactionsMAp';
import { TrnsTableComponent } from "../trns-table/trns-table.component";
import { HDetailsService } from '../../core/hdetails.service';
import { IHeaders } from '../../core/interfaces/ivDtls';
import { FormsModule } from '@angular/forms';
import { EventEmitter } from 'node:stream';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-trns-purchaces',
  standalone: true,
  imports: [TrnsTableComponent, FormsModule, MatIconModule, MatMenuModule, MatButtonModule, RouterLink],
  templateUrl: './trns-purchaces.component.html',
  styleUrl: './trns-purchaces.component.css'
})
export class TrnsPurchacesComponent  implements OnInit{

  isActiveCurr_TrstNo = signal<number>(0);
  isActiveCurr_CstID = signal<number>(0);
  isActiveCurr_TrsDt = signal<Date>(new Date());

  setisActiveCurr_TrstNo() {
    
    this.FindHeader()
    this.isActiveCurr_TrstNo.set(this.curr_TrstNo);
    this.isActiveCurr_CstID.set(this.SecHeaders.data[0].cstId)
    this.isActiveCurr_TrsDt.set(this.SecHeaders.data[0].trsDt)
    console.log("parent Changed TrsNo = " , this.curr_TrstNo)
  }
/*  setIsActiveCurr_CstID(x:number){
    this.isActiveCurr_CstID.set(x);
    console.log("parent Changed CstID = " , this.isActiveCurr_CstID)

  }*/


 

  curr_TrsTy:number =0
  curr_Store:any
  curr_StoreName:any
  curr_TrstNo!:number
  theFirstSelectedOption:any
  StaicTrstNoArr:any[] =[]

  TrnsData:TransactionMap={
    data:[
      {Trns_id:0 , Trns_name:"reandom"},
      {Trns_id:1 , Trns_name:"مشتريات"},
      {Trns_id:2 , Trns_name:"مرتجع بيع"},
      {Trns_id:3 , Trns_name:"وارد تصنيع"},
      {Trns_id:4 , Trns_name:"محول اليه"},
      {Trns_id:5 , Trns_name:"اضافة اخرى"},

      {Trns_id:6 , Trns_name:"reandom"},
      {Trns_id:7 , Trns_name:"reandom"},
      {Trns_id:8 , Trns_name:"reandom"},
      {Trns_id:9 , Trns_name:"reandom"},
      {Trns_id:10 , Trns_name:"reandom"},


      {Trns_id:11 , Trns_name:"مبيعات "},
      {Trns_id:12 , Trns_name:"مرتدات مشتروات  "}, 
      {Trns_id:13  , Trns_name:"منصرف للتصنيع   "},
      {Trns_id:14  , Trns_name:"محول منه   "},
      {Trns_id:15  , Trns_name:"صرف أخرى"},

    ]
  }

  constructor(private _route :Router,
    private _HDetailsService:HDetailsService
  ) {
     }



   IHeadersfilter=  {
      f_StrCd_name:'' as string|undefined,
      f__TrsTy:undefined as  number|undefined,
      f__TrsNo:undefined as number | undefined,
      f__TrsDt: undefined as  Date|undefined,
      /*f_CstId:undefined as  number| undefined,
      f__Val:undefined as number | undefined,
      f_Disc_name: '' as  string|undefined,
      f_OvrPrc_name: '' as  string| undefined,
      f__DTy: undefined as  number | undefined,
      f_SCd_name:'' as  string|undefined,
      f_OWn_name:'' as  string|undefined,
      f_LUsr_name:''as  string|undefined,
      f__CTm:undefined as  Date|undefined,
      f__LTm: undefined as  Date | undefined,
      f_SPrc: undefined as  number | undefined,*/
      _Sort:'' as  string | undefined,
      _pageSize: 10,
      _pageIndex: 1
    }

    Headers:IHeaders={
      pageSize: 0,
      pageIndex: 0,
      count: 0,
      totalCount: 0,
      data: []
    }

    SecHeaders:IHeaders={
      pageSize: 0,
      pageIndex: 0,
      count: 0,
      totalCount: 0,
      data: []=[
        {
          strCd: '' as string,
          trsTy:0 as  number,
          trsNo: 0,
          trsDt: new Date(),
          cstId: 0,
          val: 0,
          disc: '' as string,
          ovrPrc:'' as string,
          rem: '' as string,
          ref:0,
          dTy: 0,
          oNo: 0,
          sCd:''as string,
          pStat: 0, 
          knd: 0,
          oWn: '' as string,
          lUsr:'' as string,
          cTm:'' as string,
          lTm:'' as string,
          sPrc: 0,
          cashRef: 0,
          id: 0,
          customerName:''as string
        }
      ]

    }

    








  ngOnInit() {

    const navigationState=history.state
    console.log("navigationState.data---------->>" , navigationState.data)
    if(navigationState 
      &&navigationState.data.store_id.id
      &&navigationState.data._TrsTy
      &&navigationState.data.store_id.strNm
      &&navigationState.data.StateType ==2)
      {
        this.curr_TrsTy=navigationState.data._TrsTy
        this.curr_Store=navigationState.data.store_id.id
        this.curr_StoreName=navigationState.data.store_id.strNm
      
       }
       else{
          this._route.navigate(['/home'])
       }  

       this.IHeadersfilter.f_StrCd_name=this.curr_Store
       this.IHeadersfilter.f__TrsTy=this.curr_TrsTy
        
       this._HDetailsService.getAllHeadersFiltered(this.IHeadersfilter).subscribe({
        next:(res)=>{
          this.Headers=res
          
          for (let index = 0; index < this.Headers.data.length; index++) {
           this.StaicTrstNoArr?.push(this.Headers.data[index].trsNo)
           console.log("this.StaicTrstNoArr" , this.StaicTrstNoArr[index])
            
          }
          console.log(this.StaicTrstNoArr[0])
          console.log("Total Headers Arr ===> " , res)
          console.log("this.StaicTrstNoArr ===> " , this.StaicTrstNoArr)
          this.curr_TrstNo=this.StaicTrstNoArr[0]
          console.log("this.Headers ===> " , this.Headers)
        }
       })



       this._HDetailsService.getAllHeadersFiltered(this.IHeadersfilter).subscribe({
        next:(res)=>{
          console.log("xxxxxxxxxxxxxxxxxxxxxxxxx" , res)
          if(res.data.length> 0){
            this.SecHeaders=res

          }
        }
       })
  }


  FindHeader(){
    this.IHeadersfilter.f_StrCd_name=this.curr_Store
       this.IHeadersfilter.f__TrsTy=this.curr_TrsTy
       this.IHeadersfilter.f__TrsNo=this.curr_TrstNo
       this._HDetailsService.getAllHeadersFiltered(this.IHeadersfilter).subscribe({
        next:(res)=>{
          this.SecHeaders=res          
          console.log("this.Headers ===> " , this.Headers)
        }
      })

}



gotoAddNewDetais(){
  this._route.navigate(['/addNewDetail'] , 
    { state:{"headerData":this.SecHeaders} });
}

gotoAddnewHeader(){
  this._route.navigate(['/addNewHeader'] , 
    { state:{"headerData":this.SecHeaders} });
}
}




