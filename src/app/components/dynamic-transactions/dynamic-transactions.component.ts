import { Component, OnDestroy, OnInit, signal, inject, model, forwardRef, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Route, Router, RouterLink } from '@angular/router';
import { TransactionMap,TransactionObj } from '../../core/interfaces/transactionsMAp';
import { TrnsTableComponent } from "../trns-table/trns-table.component";
import { HDetailsService } from '../../core/hdetails.service';
import { IHeaders,Header, editeHeaderMEta } from '../../core/interfaces/ivDtls';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { CustomerTableSeprateComponent } from "../CustomTables/customer-table-seprate/customer-table-seprate.component";
import { TokenService } from '../../core/services/token.service';
import { ToastrService } from 'ngx-toastr';
import { HeaderServiceService } from '../../core/header-service.service';
import { DetailsHdrsSharedSignalsService } from '../../core/services/SignalsServices/details-hdrs-shared-signals.service';
import { DeleteAllHeadersObj } from '../../core/interfaces/HdrData';
import { customer } from '../../core/interfaces/icustomer';
import { Subject, switchMap, takeUntil, distinctUntilChanged } from 'rxjs';


export interface DialogData {
  animal: string;
  name: string;
  S_curr_TrsTy:number;
 S_curr_Store:any;
 S_curr_TrstNo:number;
 S_CstID :number;
 S_CstName:string;
}



@Component({
  selector: 'app-dynamic-transactions',
  standalone: true,
  imports: [TrnsTableComponent, DatePipe, FormsModule, MatIconModule, MatMenuModule, MatButtonModule, RouterLink, forwardRef(() => DialogOverviewExampleDialog), ReactiveFormsModule],
  templateUrl: './dynamic-transactions.component.html',
  styleUrl: './dynamic-transactions.component.css'
})
export class DynamicTransactionsComponent      implements OnInit, OnDestroy{

   objDelete :DeleteAllHeadersObj={
     hdr: {
       strCd: '',
       trsTy: 0,
       trsNo: 0
     },
     sysInfo: {
       accptMinus: 0,
       multiStore: false,
       singleStrCd: '',
       companyName: '',
       storeName: ''
     }
   }

DynamicPrompts={
  NormalFlag: 1,
  EditeFlag:0,
  AddFlag:0
};


  isActiveCurr_TrstNo = signal<number>(0);
  isActiveCurr_CstID = signal<number>(0);
  isActiveCurr_TrsDt = signal<Date>(new Date());


  receivedItemId:any
  receivedCustomer = signal<customer | null>(null);
  
  // If you need separate signals for ID and name
  receivedCustomerId = signal<number | null>(null);
  receivedCustomerName = signal<string>('');

   
  /**
   * After async header load we set `curr_TrstNo` and hydrate the UI. The `<select>` often fires
   * `(change)` when options render even though the value did not change — that used to call
   * `FindHeader()` again and duplicated GetAllHeadersFiltered + details fetches.
   */
  private appliedHeaderTrsNo: number | null = null;

  /** document number to select once the list has loaded (sent by the add / edit screens); null = the latest document */
  private preferredTrsNo: number | null = null;

  /** true once the list of documents has come back (so "no invoices" is not shown while it is still loading) */
  headersLoaded = false;

  setisActiveCurr_TrstNo() {
    if (this.appliedHeaderTrsNo === this.curr_TrstNo) {
      this.isActiveCurr_TrstNo.set(this.curr_TrstNo);
      return;
    }
    this.FindHeader();
    this.isActiveCurr_TrstNo.set(this.curr_TrstNo);
    console.log("parent Changed TrsNo = " , this.curr_TrstNo)
  }


  ReceivedDialog_S_CurrCustomer=signal<number>(0)

 

  curr_TrsTy:number =0 //Main
  curr_Store!:any     //Main
  curr_StoreName:any
  curr_TrstNo!:number
  theFirstSelectedOption:any
  StaicTrstNoArr:any[] =[]
  Curr_CustomerName!:string
  private readonly selectedHeaderTrsNo$ = new Subject<number>();
  private readonly destroy$ = new Subject<void>();

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
    private _HDetailsService:HDetailsService,
    private   _TokenService:TokenService,
    private _toastrService:ToastrService,
    private _HeaderServiceService:HeaderServiceService,
    private _DetailsHdrsSharedSignalsService:DetailsHdrsSharedSignalsService,
     
    
  ) {
  effect(()=>{
     // this.Curr_CustomerName=this.S_parentParent_selectedCustomerName()
    this.AddnewHeaderForm.patchValue({
      cstId:this.S_parentParent_selectedCustomer(),
    
    })
    })
   
     }
     hdrValue=this._DetailsHdrsSharedSignalsService.HeaderValue



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
      _pageSize: 1000,
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
          customerName:'' as string
        }
      ]

    }



  ngOnInit() {

    const stateData = history.state?.data
    console.log("navigationState.data---------->>" , stateData)
    // The store NAME is only shown on the screen, so a state without it (e.g. coming back from a lines screen that did not
    // know it) must not throw the user out to /home: only the store code and the type are really needed.
    if(stateData
      &&stateData.store_id?.id
      &&stateData._TrsTy
      &&stateData.StateType ==2)
      {
        this.curr_TrsTy=stateData._TrsTy
        this.curr_Store=stateData.store_id.id
        this.curr_StoreName=stateData.store_id.strNm || stateData.store_id.id
        // the document to select after the list is loaded (the one just added / edited); none = the latest
        this.preferredTrsNo = stateData.selectedTrsNo ?? null
       }
       else{
          this._route.navigate(['/home'])
          return
       }  

       this.IHeadersfilter.f_StrCd_name=this.curr_Store
       this.IHeadersfilter.f__TrsTy=this.curr_TrsTy
       this.setupSelectedHeaderStream();
       this.loadInitialHeaders();


       this.AddnewHeaderForm.patchValue({
        strCd: this.curr_Store,
        trsTy: this.curr_TrsTy,
        
        cstId: this.S_parentParent_selectedCustomer(),
        oWn:  this._TokenService.getGivenName()
       })
        
      
      
      this.isHeaderDeleted=-1
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.selectedHeaderTrsNo$.complete();
  }
  

  FindHeader(){
    this.IHeadersfilter.f_StrCd_name=this.curr_Store
       this.IHeadersfilter.f__TrsTy=this.curr_TrsTy
       this.IHeadersfilter.f__TrsNo=this.curr_TrstNo
       this.applySelectedHeader(this.curr_TrstNo);

}

private loadInitialHeaders() {
  this.headersLoaded = false;
  this._HDetailsService.getAllHeadersFiltered(this.IHeadersfilter).subscribe({
    next: (res: IHeaders) => {
      this.Headers = res;
      this.headersLoaded = true;

      if (!res?.data?.length) {
        this.clearHeaderUi();
        return;
      }

      this.StaicTrstNoArr = res.data.map((header: Header) => header.trsNo);
      // the list is newest first: the wanted document (just added / edited), otherwise the latest one
      const wanted = this.preferredTrsNo != null
        ? res.data.find((header: Header) => header.trsNo === this.preferredTrsNo)
        : undefined;
      const selected: Header = wanted ?? res.data[0];
      this.preferredTrsNo = null;

      this.curr_TrstNo = selected.trsNo as number;
      this.IHeadersfilter.f__TrsNo = this.curr_TrstNo;
      /** First response already includes the selected header row — avoid a second identical GetAllHeadersFiltered on load */
      this.applyHeaderRowToUi(selected, res);
    },
    error: () => { this.headersLoaded = true; }
  });
}

/**
 * Calls the whole list of documents again (the safest way to be in step with the database) and selects the latest one,
 * or `preferredTrsNo` when it is given. The filter is rebuilt from scratch: a leftover f__TrsNo would bring back ONE document.
 */
private reloadAllHeaders(preferredTrsNo: number | null = null): void {
  this.preferredTrsNo = preferredTrsNo;
  this.IHeadersfilter = {
    f_StrCd_name: this.curr_Store,
    f__TrsTy: this.curr_TrsTy,
    f__TrsNo: undefined as number | undefined,
    f__TrsDt: undefined as Date | undefined,
    _Sort: '' as string | undefined,
    _pageSize: 1000,
    _pageIndex: 1
  };
  this.loadInitialHeaders();
}

/**
 * This type has no document at all: forget everything that belonged to the document shown before. The invoice value lives in a
 * service shared by all screens, so without this the value of the PREVIOUSLY opened type (e.g. 6000 of the purchases) stayed on
 * screen, as did its customer and date.
 */
private clearHeaderUi(): void {
  this.StaicTrstNoArr = [];
  this.curr_TrstNo = 0;
  this.appliedHeaderTrsNo = null;
  this.SecHeaders = { ...this.Headers, data: [] };
  this.isActiveCurr_CstID.set(0);
  this.isActiveCurr_TrsDt.set(new Date());
  this._DetailsHdrsSharedSignalsService.setHeaderValue(0);
  this.hdrValue.set({ totalVal: 0 });
}

/** Single place to sync header row into the prompt + signals (used on full list or filtered response). */
private applyHeaderRowToUi(selectedHeader: Header, listEnvelope: IHeaders): void {
  this.appliedHeaderTrsNo = selectedHeader.trsNo;
  this.SecHeaders = {
    ...listEnvelope,
    data: [selectedHeader]
  };
  this.isActiveCurr_CstID.set(selectedHeader.cstId);
  this.isActiveCurr_TrsDt.set(selectedHeader.trsDt);
  this._DetailsHdrsSharedSignalsService.setHeaderValue(selectedHeader.val);
  this.editeHeaderMEtadata = {
    hdr: selectedHeader,
    cur_StoreName: this.curr_StoreName,
    cur_Trstys: this.TrnsData.data[this.curr_TrsTy].Trns_name
  };
  this.hdrValue.set({
    ...this.hdrValue(),
    totalVal: selectedHeader.val
  });
}

private setupSelectedHeaderStream() {
  this.selectedHeaderTrsNo$
    .pipe(
      // (no distinctUntilChanged here: setisActiveCurr_TrstNo already ignores the number that is on screen)
      switchMap((trsNo: number) => {
        this.IHeadersfilter.f__TrsNo = trsNo;
        return this._HDetailsService.getAllHeadersFiltered(this.IHeadersfilter);
      }),
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: (res: IHeaders) => {
        if (!res?.data?.length) {
          return;
        }

        this.applyHeaderRowToUi(res.data[0], res);
      }
    });
}

private applySelectedHeader(trsNo: number) {
  this.selectedHeaderTrsNo$.next(trsNo);
}


FindHeaderWithStaticArr(){  


     this.IHeadersfilter=  {
      f_StrCd_name:this.curr_Store,
      f__TrsTy:this.curr_TrsTy,
      f__TrsNo:undefined as number | undefined,
      f__TrsDt: undefined as  Date|undefined,
     
      _Sort:'' as  string | undefined,
      _pageSize: 1000,
      _pageIndex: 1
    }
    
        
     this._HDetailsService.getAllHeadersFiltered(this.IHeadersfilter).subscribe({
      next:(res)=>{
        this.SecHeaders=res
        this.appliedHeaderTrsNo = this.curr_TrstNo;
        this.StaicTrstNoArr.length=0
        console.log("this.SecHeaders=this.SecHeaders=this.SecHeadersSecHeadersSecHeaders=", this.SecHeaders.data.length)
        console.log("FindHeaderWithStaticArr -this.Headers.data.length" , this.Headers.data.length)
        for (let index = 0; index <this.SecHeaders.data.length; index++) {
         this.StaicTrstNoArr?.push(this.SecHeaders.data[index].trsNo)
         console.log(`this.StaicTrstNoArr${index}` , this.StaicTrstNoArr[index])
          
        }
        console.log(this.StaicTrstNoArr[0])
        console.log("Total Headers Arr ===> " , res)
        console.log("this.StaicTrstNoArr ===> " , this.StaicTrstNoArr)
        
        console.log("this.Headers ===> " , this.Headers)
      }
     })


}



/*
gotoAddNewDetais(){
  this._route.navigate(['/addNewDetail'] , 
    { state:{"headerData":this.SecHeaders} });
}
gotoAddnewHeader(){
  this._route.navigate(['/addNewHeader'] , 
    { state:{"headerData":this.SecHeaders} });
}*/
readonly animal = signal('');//signal recieve
readonly S_parentParent_selectedCustomer = signal<number>(0);//signal recieve
readonly S_parentParent_selectedCustomerName = signal<string>('');//signal recieve
readonly name = model('');// model send
readonly S_curr_TrsTy=model(this.curr_TrsTy)
readonly S_curr_Store=model(this.curr_Store)
readonly  S_curr_TrstNo=model(this.curr_TrstNo)
readonly S_CstID=model('')
readonly dialog = inject(MatDialog);
openDialog(): void {
  const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
    data: { 
       S_CstID :this.S_parentParent_selectedCustomer(),
       S_CstName :this.S_parentParent_selectedCustomerName()
      },
  });

 /* dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    console.log('Result:', result); // Check what you're receiving
    if (result !== undefined) {
      this.animal.set(result);
      this.S_parentParent_selectedCustomer.set(result.S_CstID)
      this.S_parentParent_selectedCustomerName.set(result.S_CstName)

    }
  });*/
  dialogRef.afterClosed().subscribe(result => {
    if (!result) {
      return;
    }
      this.S_parentParent_selectedCustomer.set(result.S_CstID);
      this.S_parentParent_selectedCustomerName.set(result.S_CstName);
  
      // ✅ directly update form here
      this.AddnewHeaderForm.patchValue({
        cstId: result.S_CstID
      });
  });
}

AddNewHeader(){
  this.DynamicPrompts.AddFlag=1;
  this.DynamicPrompts.EditeFlag=0;
  this.DynamicPrompts.NormalFlag=0

  this.AddnewHeaderForm.patchValue({
    strCd: this.curr_Store,
    trsTy: this.curr_TrsTy,
    trsNo: Math.max(0, ...this.StaicTrstNoArr) + 1,
    
    //cstId: this.S_parentParent_selectedCustomer(),
    oWn:  this._TokenService.getGivenName(),



    
    trsDt: null,
    cstId: null,//[0]
    val:null,
    disc: null,
    ovrPrc: null,
    rem: null,
    ref: null,
    dTy: null,
    oNo:null,
    sCd: null,
    pStat:null,
    knd:null,
    
    lUsr: null,
    cTm: null,
    lTm: null,
    sPrc: null,
    cashRef: null
   })
 //  this.S_parentParent_selectedCustomer.set(0)
}

EditeHeader(){
  this.DynamicPrompts.AddFlag=0;
  this.DynamicPrompts.EditeFlag=1;
  this.DynamicPrompts.NormalFlag=0
}

RemoveHeader(){
  this.DynamicPrompts.AddFlag=1;
  this.DynamicPrompts.EditeFlag=0;
  this.DynamicPrompts.NormalFlag=0
}

backToNormal(){
  this.DynamicPrompts.AddFlag=0;
  this.DynamicPrompts.EditeFlag=0;
  this.DynamicPrompts.NormalFlag=1
}




private fb = inject(FormBuilder);
  
  AddnewHeaderForm: FormGroup = this.fb.group({
    strCd: [0],
    trsTy: [0],
    trsNo: null,
    trsDt: null,
    cstId: null,//[0]
    val:null,
    disc: null,
    ovrPrc: null,
    rem: null,
    ref: null,
    dTy: null,
    oNo:null,
    sCd: null,
    pStat:null,
    knd:null,
    oWn: null,
    lUsr: null,
    cTm: null,
    lTm: [this.getCurrentDateTime()],
    sPrc: null,
    cashRef: null
  });

  private getCurrentDateTime(): string {
    return new Date().toISOString().slice(0, 16); // Format for datetime-local input
  }

  onSubmit() {
    if (this.AddnewHeaderForm.valid) {
      
    console.log(this.AddnewHeaderForm.value)
   
    this._HDetailsService.AddNewHeaders(this.AddnewHeaderForm.value).subscribe({
      next:(res)=>{
        console.log(res)

        this.curr_TrstNo=this.AddnewHeaderForm.get("trsNo")?.value
        console.log("======================>",this.curr_TrstNo)
        this.FindHeaderWithStaticArr()
        this.backToNormal()
        this._toastrService.success("اضافة هيدر جديد" , "تمت اضافة الهيدر بنجاح")
     //   this.FindHeader()



      }
    })
   
    }

}


  fakeSearch(){
    this._toastrService.error("البحث عن تفاصيل" , "لا يوجد بيانات لعرضها")
  }
  fakeAddNewDetails(){
    this._toastrService.error("اضافة تفاصيل للفاتورة" , "يجب اضافة هيدر اولا")

  }



  editeHeaderMEtadata:editeHeaderMEta={
    hdr: this.SecHeaders.data[0],
    cur_StoreName: this.curr_Store,
    cur_Trstys: this.TrnsData.data[this.curr_TrsTy].Trns_name
  }

  /** a header can be edited / deleted only when one is really selected: its store, type and number must all be known */
  get canEditHeader(): boolean {
    const hdr = this.SecHeaders?.data?.[0];
    return !!hdr && !!hdr.strCd && hdr.trsTy != null && !!hdr.trsNo
      && this.curr_TrstNo > 0 && this.StaicTrstNoArr.length > 0;
  }

  private warnNoHeader(title: string): void {
    this._toastrService.warning('لا يوجد مستند من هذا النوع', title, { positionClass: 'toast-top-left' });
  }

  editeHeader(){
    if (!this.canEditHeader) {
      this.warnNoHeader('تعديل هيدر');
      return;
    }

    // always built from the header that is selected right now, never from an older one
    this.editeHeaderMEtadata = {
      hdr: this.SecHeaders.data[0],
      cur_StoreName: this.curr_StoreName,
      cur_Trstys: this.TrnsData.data[this.curr_TrsTy].Trns_name
    };
    console.log("this.SecHeadersthis.SecHeaders" , this.editeHeaderMEtadata)
    this._route.navigate(['/addNewHeader'] , { state:{data:this.editeHeaderMEtadata} })
  }



  isHeaderDeleted:number=-1
  clickDelete(){
    if (!this.canEditHeader) {
      this.warnNoHeader('حذف هيدر');
      return;
    }
    this.isHeaderDeleted=1
  }
  dontDelete(){
    this.isHeaderDeleted=-1
  } 

  deleteHeader(){

   
  console.log("gggggggggggggg")
  console.log("this.curr_Store" ,this.curr_Store,"this.curr_TrsTy",this.curr_TrsTy,"this.curr_TrstNo",this.curr_TrstNo)

    this.objDelete={
      hdr:{
        strCd:this.curr_Store,
        trsTy: this.curr_TrsTy,
        trsNo: this.curr_TrstNo
      },
      sysInfo:{
        accptMinus:Number(sessionStorage.getItem('AcceptMinus')),  //0 => check , 1=> ignore check , check with warning => 2
        multiStore: false,
        singleStrCd: '',
        companyName: '',
        storeName: ''
      }
    }
    this._HeaderServiceService
    .deleteHeadersParallels(this.objDelete)
    .subscribe({
      next: (res) => {
        console.log("SUCCESS:", res);     

        // the database has confirmed the delete (an error answer never reaches this point): call ALL the headers again, so the
        // screen shows exactly what is in the database - the deleted document is gone, the value / customer / lines follow the new selection
        this.reloadAllHeaders();
        
        if(res.isWarning==true){
          this._toastrService.warning("حذف الرصيد",res.errors ,{
            closeButton: true,
          enableHtml: true,positionClass: 'toast-center-center',
          toastClass: 'ngx-toastr custom-large-toast',
          tapToDismiss:true,
          })
        
        }
        else{
            this._toastrService.success("حذف الرصيد" , "تم حذف الرصيد بنجاح",{
              closeButton: true,
            enableHtml: true,positionClass: 'toast-center-center',
            toastClass: 'ngx-toastr custom-large-toast',
            tapToDismiss:true,
            })
          }

      },
      error: (err) => {
        console.log("ERROR STATUS:", err.status);
        console.log("ERROR BODY:", err.error);
      }
    });


   this.isHeaderDeleted=-1

   const store_id={
    id:this.curr_Store,
    strNm:this.curr_StoreName
  }

  const data={
    store_id:store_id ,          
    _TrsTy:this.curr_TrsTy,
    StateType:2
    }
  console.log("data = bavk loofofofofofo " ,data)
 // window.location.reload();



     

  }


  AddNewHeaderSeperate(){
    

    const userData = {             
      StrCd:this.curr_Store,
      StoreName:this.curr_StoreName,
      TrsTy: this.curr_TrsTy
    };

    this._route.navigate(['/addNewHeaderSeperate'], {
      state: {
        data: userData
      }
    });


  }

}




@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  standalone:true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose, TrnsTableComponent,
    CustomerTableSeprateComponent
],
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly animal = model('');
   S_SelectedCustomer=signal<number>(this.data.S_CstID)//recieved data 
   S_SelectedCustomerName=signal<string>(this.data.S_CstName)//recieved data 
   readonly SelectedCustomerData = model(this.data.S_CstID)


   onCustomerSelected( ){
   // Send updated data immediately
    const result = {
      S_CstID: this.receivedCustomerId(),
      S_CstName: this.receivedCustomerName(),
      animal: this.animal()
    };
    this.dialogRef.close(result);
    console.log("Result Signallllll!!!!!!!" ,result )

   }


  onNoClick(): void {
    this.dialogRef.close();
  }

  receivedItemId:any
  receivedCustomer = signal<customer | null>(null);
  
  // If you need separate signals for ID and name
  receivedCustomerId = signal<number | null>(null);
  receivedCustomerName = signal<string>('');
  onItemIdReceived(customer:customer){
    console.log('Parent received item ID:XXXXXX', customer);    
    // Store the received IDs
     // Update the signals with the received data
     this.receivedCustomer.set(customer);
     this.receivedCustomerId.set(customer.id);
     this.receivedCustomerName.set(customer.cstNm);
    this.receivedItemId = customer;
  }
}




