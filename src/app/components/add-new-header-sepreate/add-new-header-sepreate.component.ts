import { Component, effect, forwardRef, HostListener, inject, OnInit, signal } from '@angular/core';
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes-guard.guard';
import { HeaderServiceService } from '../../core/header-service.service';
import { TokenService } from '../../core/services/token.service';
import { ToastrService } from 'ngx-toastr';
 
import { CustomerTableSeprateComponent } from "../CustomTables/customer-table-seprate/customer-table-seprate.component";
import { customer } from '../../core/interfaces/icustomer';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { updateHeader } from '../../core/interfaces/ivDtls';
import { Router } from '@angular/router';
import { TransactionMap } from '../../core/interfaces/transactionsMAp';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { DialogOverviewExampleDialog } from '../dynamic-transactions/dynamic-transactions.component';
import { HDetailsService } from '../../core/hdetails.service';
@Component({
  selector: 'app-add-new-header-sepreate',
  standalone: true,
  imports: [CustomerTableSeprateComponent , FormsModule,ReactiveFormsModule,
    MatIconModule, MatMenuModule, MatButtonModule,forwardRef(() => DialogOverviewExampleDialog)
  ],
  templateUrl: './add-new-header-sepreate.component.html',
  styleUrl: './add-new-header-sepreate.component.css'
})
export class AddNewHeaderSepreateComponent implements OnInit,CanComponentDeactivate{
 

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
  
 
 
  readonly S_parentParent_selectedCustomer = signal<number>(0);//signal recieve
  readonly S_parentParent_selectedCustomerName = signal<string>('');//signal recieve
  private getCurrentDateTime(): string {
    return new Date().toISOString().slice(0, 16); // Format for datetime-local input
  }

  
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
  
  
  HeadersDetails:any
  selectedOption:number | undefined

    // Using signal for the received customer data
    receivedCustomer = signal<customer | null>(null);
  
    // If you need separate signals for ID and name
    receivedCustomerId = signal<number | null>(null);
    receivedCustomerName = signal<string>('');
  
  constructor(private _headerServiceService:HeaderServiceService,
    private _TokenService:TokenService,
    private _ToastrService:ToastrService,
    private _route:Router,    private _HDetailsService:HDetailsService,
 
    private _toastrService:ToastrService, 
  ) {
    effect(()=>{
       this.Curr_CustomerName=this.S_parentParent_selectedCustomerName()
     this.AddnewHeaderForm.patchValue({
       cstId:this.S_parentParent_selectedCustomer(),
     
     })
     })
    
    
  }
  curr_Store:any
  Curr_CustomerName:any
  curTrsty_number!:number
  curTrsNo_number!:number
  ngOnInit(): void {
    console.log("ngoniniiiiiiiiiiiiiiiiiiiiiiiiiiiiiiit")
    const navigationState = history.state;

    console.log("dataaaaaaaaaaaaaaxxxxxxxxxxxx" , navigationState.data)
    if (navigationState && navigationState.data) {
      this.HeadersDetails = navigationState.data;
      console.log("this.detailsMetaData========>>>>>>>>",this.HeadersDetails)
    }

    this.curr_TrsTy=this.HeadersDetails.TrsTy
    this.curr_Store=this.HeadersDetails.StrCd
    this.curTrsty_number=Number(this.HeadersDetails.TrsTy)

    const header:any={
      "strCd": this.curr_Store,
      "trsTy": this.curr_TrsTy     
    }
     this._HDetailsService.getMaxHeadersTrsNo(header).subscribe({
      next:(res)=>{
        this.curTrsNo_number=res
        console.log("this.curTrsNo_number=res" , this.curTrsNo_number)
        this.AddnewHeaderForm.get('trsNo')?.setValue(this.curTrsNo_number);
      }
     })
    
    console.log("this._updateHeader.cstId================>>>>>" , this._updateHeader.cstId)
    this.AddnewHeaderForm.patchValue({
      strCd: this.curr_Store,
      trsTy: this.curr_TrsTy,
       
      
      cstId: this.S_parentParent_selectedCustomer(),
      oWn:  this._TokenService.getGivenName()
     })
    
  }
  curr_TrsTy:any
  receivedItemId:any
  onItemIdReceived(customer:customer){
    console.log('Parent received item ID:', customer);    
    // Store the received IDs
     // Update the signals with the received data
     this.receivedCustomer.set(customer);
     this.receivedCustomerId.set(customer.id);
     this.receivedCustomerName.set(customer.cstNm);
    this.receivedItemId = customer;
  }
_updateHeader:updateHeader={
  cstId: 0,
  dTy: 0,
  lUsr: '',
  lTm: new Date()
}


  editeHeaderData()
  {
    this._updateHeader={
      cstId: this.receivedItemId.id ,
      dTy:  this.selectedOption,
      lUsr: this._TokenService.getGivenName(),
      lTm: new  Date()
    }



    this._headerServiceService.EditeHeadersData(this._updateHeader,this.HeadersDetails.hdr.strCd , this.HeadersDetails.hdr.trsTy , this.HeadersDetails.hdr.trsNo)
    .subscribe({
      next:(res)=>{
        console.log(res)
        this.isSaved=true

        const store_id={
          id:this.HeadersDetails.hdr.strCd,
          strNm:this.HeadersDetails.cur_StoreName
        }

        const data={
          store_id:store_id ,          
          _TrsTy:this.HeadersDetails.hdr.trsTy,
          StateType:2
          }
        console.log("data = bavk loofofofofofo " ,data)
        this._route.navigate(['/Transactions'] , {state:{data:data}})
    
        this._ToastrService.success("تعديل هيدر" , "تم تعديل بيانات الهيدر بنجاح" ,
          {positionClass:	'toast-top-left'}
        )
      }
    })
  }

/************************************** */
  

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
  ReceivedDialog_S_CurrCustomer=signal<number>(0)
  readonly dialog = inject(MatDialog);
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { 
         S_CstID :this.S_parentParent_selectedCustomer(),
         S_CstName :this.S_parentParent_selectedCustomerName()
        },
    });

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
curr_TrstNo:any
onSubmit() {
  if (this.AddnewHeaderForm.valid) {
    
    if(this.AddnewHeaderForm.get('trsTy')?.value == 3 ||
     this.AddnewHeaderForm.get('trsTy')?.value == 5 ||
     this.AddnewHeaderForm.get('trsTy')?.value == 13||
     this.AddnewHeaderForm.get('trsTy')?.value == 15){
      this.AddnewHeaderForm.get('cstId')?.setValue(null);
    }
  console.log(this.AddnewHeaderForm.value)
 
  this._HDetailsService.AddNewHeaders(this.AddnewHeaderForm.value).subscribe({

    next:(res)=>{
      console.log(res)

      this.curr_TrstNo=this.AddnewHeaderForm.get("trsNo")?.value
      console.log("======================>",this.curr_TrstNo)
      /*this.curr_TrsTy=navigationState.data._TrsTy
      this.curr_Store=navigationState.data.store_id.id
      this.curr_StoreName=navigationState.data.store_id.strNm*/
      this._route.navigate(['/Transactions'], {
        state: {
          data: {
            _TrsTy:  this.curr_TrsTy,
            StateType :2,
            store_id:{
              id:this.curr_Store,
              strNm:this.HeadersDetails.StoreName
            }
          }
        }
      });
      this._toastrService.success("اضافة هيدر جديد" , "تمت اضافة الهيدر بنجاح")
   //   this.FindHeader()



    }
  })
 
  }

}
}
