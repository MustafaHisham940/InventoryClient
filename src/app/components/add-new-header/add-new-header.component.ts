import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, signal } from '@angular/core';
import { ItemsTableSeprateComponent } from '../CustomTables/items-table-seprate/items-table-seprate.component';
import { CustomerTableSeprateComponent } from "../CustomTables/customer-table-seprate/customer-table-seprate.component";
import { FormsModule } from '@angular/forms';
import { HeaderServiceService } from '../../core/header-service.service';
import { updateHeader } from '../../core/interfaces/ivDtls';
import { TokenService } from '../../core/services/token.service';
import { customer } from '../../core/interfaces/icustomer';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes-guard.guard';
 

@Component({
  selector: 'app-add-new-header',
  standalone: true,
  imports: [ItemsTableSeprateComponent, CommonModule, CustomerTableSeprateComponent , FormsModule],
  templateUrl: './add-new-header.component.html',
  styleUrl: './add-new-header.component.css'
})
export class AddNewHeaderComponent  implements OnInit,CanComponentDeactivate{
  
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
    private _route:Router
  ) {
    
    
  }

  ngOnInit(): void {
    
    const navigationState = history.state;

    console.log("dataaaaaaaaaaaaaa" , navigationState.data)
    if (navigationState && navigationState.data) {
      this.HeadersDetails = navigationState.data;
      console.log("this.detailsMetaData========>>>>>>>>",this.HeadersDetails)
    }
    this.selectedOption=this.HeadersDetails.hdr.dTy
    this.receivedItemId =this.HeadersDetails.hdr.cstId 
    

    this._updateHeader={
      cstId: this.HeadersDetails.hdr.cstId,
      dTy: this.HeadersDetails.hdr.dTy,
      lUsr: '',
      lTm: new Date()
    }

    console.log("this._updateHeader.cstId================>>>>>" , this._updateHeader.cstId)

    
  }
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


}
