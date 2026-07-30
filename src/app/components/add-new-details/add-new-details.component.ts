import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsTableSeprateComponent } from "../CustomTables/items-table-seprate/items-table-seprate.component";
import { item } from '../../core/interfaces/iitem';
import { TransactionMap } from '../../core/interfaces/transactionsMAp';
import { HeaderServiceService } from '../../core/header-service.service';
import { Details, Dtls, Header } from '../../core/interfaces/ivDtls';
import { HDetailsService } from '../../core/hdetails.service';
import { TokenService } from '../../core/services/token.service';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes-guard.guard';


@Component({
  selector: 'app-add-new-details',
  standalone: true,
  imports: [ItemsTableSeprateComponent,CommonModule,FormsModule],
  templateUrl: './add-new-details.component.html',
  styleUrl: './add-new-details.component.css'
})
export class AddNewDetailsComponent implements OnInit,CanComponentDeactivate {

  isSaved:boolean=false
  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.isSaved==false) {
      event.preventDefault();
      event.returnValue = true;
    }
  }


  canDeactivate(): boolean {
    if (this.isSaved == false) {
      return confirm('لم يتم تحديث البيانات بعد , هل انت تريد الخروج بدون تحديث البيانات؟');
    }
    return true;
  }


  SecDetails:Dtls={
    storeName: '',
    strCd: '',
    trsTy: 0,
    trsNo: 0,
    lnNo: 0,
    trsDt: '',
    customerName: '',
    cstId: 0,
    itemName: '',
    itmCd: '',
    qty: 0,
    pric: 0,
    bCd: 0,
    bck: 0,
    oNo: 0,
    gQty: 0,
    own: '',
    lUsr: '',
    cTm: '',
    lTm: '',
    cst: 0,
    id: undefined
  }

  SecHeaders:Header={
    strCd: '',
    trsTy: 0,
    trsNo: 0,
    trsDt: new Date ,
    customerName: '',
    cstId: 0,
    val: 0,
    disc: '',
    ovrPrc: '',
    rem: '',
    ref: 0,
    dTy: 0,
    oNo: 0,
    sCd: '',
    pStat: 0,
    knd: 0,
    oWn: '',
    lUsr: '',
    cTm: '',
    lTm: '',
    sPrc: 0,
    cashRef: 0,
    id: undefined
  }

   
  constructor(private _HeaderServiceService:HeaderServiceService
    ,private _HDetailsService:HDetailsService,private _tokenService:TokenService,
    private _headerServiceService:HeaderServiceService,
    private _route:Router,
    private _ToastrService:ToastrService
  ) {
    
    
  }
  
  detailsMetaData:any
  ngOnInit(): void {
    const navigationState = history.state;

    console.log("dataaaaaaaaaaaaaa" , navigationState.data)
    if (navigationState && navigationState.data) {
      this.detailsMetaData = navigationState.data;
      console.log("this.detailsMetaData========>>>>>>>>",this.detailsMetaData)
    }

    this._UpdateDetailsForm={
      itmCd:this.detailsMetaData.Item.itmCd,
      qty:this.detailsMetaData.Item.qty,
      pric:this.detailsMetaData.Item.pric,
      lUsr: this._tokenService.getGivenName()
    }
      this._Icustomerfilter={
        _StrCd: this.detailsMetaData.store_id,
    _TrsTy:this.detailsMetaData.trsTy,
    _TrsNo:this.detailsMetaData.trsNo,
    _LnNo: this.detailsMetaData.lnNo,
    _pageIndex: 1 as number,
    _pageSize: 10
      }

      this._HDetailsService.getAllHeadersFiltered(this._Icustomerfilter).subscribe({
  
        next:(res)=>{
         
         this.SecHeaders=res
         
          
        }
       })

      this._HeaderServiceService.getAllDetailsFiltered(this._Icustomerfilter).subscribe({
  
        next:(res)=>{
         
         this.SecDetails=res
         
          
        }
       })

  }

  receivedItemId:any
  onItemIdReceived(itemId:any){
    console.log('Parent received item ID:', itemId);    
    // Store the received ID
    this._UpdateDetailsForm.itmCd = itemId;
  }

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


 
  _Icustomerfilter = {
    _StrCd: '' as string | undefined,
    _TrsTy:undefined as number | undefined,
    _TrsNo:undefined as number | undefined,
    _LnNo: undefined as number | undefined,
    /*_TrsDt: undefined as Date | undefined,

    _CstId:  undefined as number | undefined|null,
    _ItmCd: '' as string | undefined,
    _Qty: undefined as number | undefined,
    _Pric: undefined as number | undefined,
    _BCd:  undefined as number | undefined,
    _Bck:  undefined as number | undefined,
    _ONo: undefined as number | undefined,
    _GQty: undefined as number | undefined,
    _Own: '' as string | undefined,
    _LUsr: '' as string | undefined,
    _CTm: undefined as Date | undefined,
    _LTm: undefined as Date | undefined,
    _Cst:  undefined as number | undefined,
    _Sort: '' as string | undefined,*/
    _pageIndex: 1 as number,
    _pageSize: 10
  
  };




  _UpdateDetailsForm={
    itmCd: '' as string | undefined,
    qty:undefined as number | undefined,
    pric:undefined as number | undefined,
    lUsr  : '' as string | null
  }


  updateDtlsData(){
  console.log("this.updateDtlsData=>>>>>>>"+this._UpdateDetailsForm.itmCd) 
  console.log("this.updateDtlsData=>>>>>>>"+this._UpdateDetailsForm.qty) 
  console.log("this.updateDtlsData=>>>>>>>"+this._UpdateDetailsForm.pric) 
  console.log("this.updateDtlsData=>>>>>>>"+this._UpdateDetailsForm.lUsr) 
  console.log("this.updateDtlsData=>>>>>>>"+this._UpdateDetailsForm) 

  

  this._headerServiceService.EditeDetailsData(this._UpdateDetailsForm 
    ,this.detailsMetaData.curr_Store_id,this.detailsMetaData.curr_TrsTy,this.detailsMetaData.Item.trsNo
    ,this.detailsMetaData.Item.lnNo
  ).subscribe({
    next:(res)=>{console.log(res)
      this.isSaved=true

      const store_id={
        id:this.detailsMetaData.Item.strCd,
        strNm:this.detailsMetaData.Item.storeName
      }

      const data={
        store_id:store_id ,          
        _TrsTy:this.detailsMetaData.Item.trsTy,
        StateType:2
        }
      console.log("data = bavk loofofofofofo " ,data)
      this._route.navigate(['/Transactions'] , {state:{data:data}})
  
      if(res.obj !=null){
        this._ToastrService.warning("تعديل السطر" , res.message ,
          {
            positionClass: 'toast-center-center',
            toastClass: 'ngx-toastr custom-large-toast',
            tapToDismiss:true,
            disableTimeOut:true,
            closeButton:true


          }
        )
      }else{
        this._ToastrService.success("تعديل السطر" , "تم تعديل بيانات السطر بنجاح" ,
          {positionClass: 'toast-center-center',
            toastClass: 'ngx-toastr custom-large-toast',
            tapToDismiss:true,
            disableTimeOut:true,
            closeButton:true}
        )
      }
     


    }

  })
 
}

}
