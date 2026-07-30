import { Component, inject, OnInit } from '@angular/core';
import { CustomerServiceService } from '../../core/services/customer-service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Icustomer,Icustomerfilter } from '../../core/interfaces/icustomer';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { NavbarHoverDirective } from '../../core/directives/navbar-hover.directive';
import { ToastrService } from 'ngx-toastr';
import { FixedButtonComponent } from "../fixed-button/fixed-button.component";
import { TranslateModule } from '@ngx-translate/core';
import { FixedClickComponent } from "../fixed-click/fixed-click.component";
import { TruncatePipe } from '../../core/pipes/truncate.pipe';
 
@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [FormsModule, RouterModule,
     NavbarHoverDirective, FixedButtonComponent,
      TranslateModule, FixedClickComponent,
    TruncatePipe],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent  implements OnInit{
onEditButtonClicked() {
  this.gotoAddClient();
}
  _customers: Icustomer= { data: [] } as any;
  responsePages!:number
  pagesList: number[] = []
  isDeleted!:number
  deletedCustomer!:number
  curPdgIdx!:number
  private _ToastrService=inject(ToastrService)
   
 // _Icustomerfilter!:Icustomerfilter 

  _Icustomerfilter = {
    Id: undefined as number | undefined,
    Gov: undefined as number | undefined,
    Mrkz: undefined as number | undefined,
    Address: '' as string | undefined,
   // Type: undefined as number | undefined,
   // Pst: undefined as number | undefined,

   Type: '' as string|undefined,
    Pst: '' as string | undefined,
    Sort: '' as string | undefined,
    Name: '' as string | undefined,
    pageIndex: 1 as  number,
    pageSize: undefined as number | undefined
  };



  constructor(private _customerservice:CustomerServiceService,
    private Actroute:ActivatedRoute,
    private _route:Router
  ){
    this.isDeleted=-1
    this.deletedCustomer=-1
    this.curPdgIdx=1
  }

  _totalCustomerCount:number=0
  _totalBidderCount:number =0
  _totalBuyerCount:number=0
  _totalBothCount:number=0
  ngOnInit(): void {
    this.isDeleted=-1 // no element is set to be deleted
    this.deletedCustomer=-1 // the id of customer is to be deleted is null
    this._Icustomerfilter.pageIndex=1;
    this.curPdgIdx=1
    
    this._customerservice.GetAllCustomers().subscribe({

     next:(res)=>{
      
      this._customers=res
      
       console.log("Welcome!!!!!",res)
       this.calculatePageNumber();
       this.fillPagesList();
     }
    })

    this._customerservice.getTotalCounts().subscribe({
      next:(res)=>{
        this._totalCustomerCount=res.data.myProperty.totalCustomerCount
        this._totalBidderCount=res.data.myProperty.totalBidderCount
        this._totalBuyerCount=res.data.myProperty.totalBuyerCount
        this._totalBothCount=res.data.myProperty.totalBothCount
      }
    })
 }

 

 searchCustomers() {
  console.log(this._Icustomerfilter);
  this._Icustomerfilter.pageIndex=1;
  this.curPdgIdx=this._Icustomerfilter.pageIndex
  this._customerservice.getAllCustomers(this._Icustomerfilter).subscribe({
    next: (res) => {
      this._customers = res;
      console.log( this._customers);
      this.calculatePageNumber();
      this.fillPagesList();
    },

    error: (err) => {
      console.error('Error fetching customers:', err);
    }

  });
}


calculatePageNumber(){
  this.responsePages= Math.ceil(this._customers.count / this._customers.pageSize);
  
  console.log("pgIndx="+this._customers.pageIndex + "pgcount="+this._customers.count)
  console.log("Hhhhhhhhh =  "+this.responsePages)
 
}


fillPagesList(){
  this.pagesList=[]
  for (let index = 0; index < this.responsePages; index++) {
     this.pagesList.push(index+1);
      console.log(this.pagesList)
  }
   
}
navigatePaging(pgIdx:number){
  this._Icustomerfilter.pageIndex=pgIdx;
  this.curPdgIdx=this._Icustomerfilter.pageIndex
  console.log("currPage=" +this._Icustomerfilter.pageIndex );

  this.searchCustomersNofill();
}



searchCustomersNofill() {
  console.log(this._Icustomerfilter);
   
  this._customerservice.getAllCustomers(this._Icustomerfilter).subscribe({
    next: (res) => {
      this._customers = res;
      console.log( this._customers);
      this.calculatePageNumber();
      
    },

    error: (err) => {
      console.error('Error fetching customers:', err);
    }

  });
}

clearFilter(){

  this._Icustomerfilter = {
    Id: undefined as number | undefined,
    Gov: undefined as number | undefined,
    Mrkz: undefined as number | undefined,
    Address: '' as string | undefined,
    Type: '' as string|undefined,
    Pst: '' as string | undefined,
    Sort: '' as string | undefined,
    Name: '' as string | undefined,
    pageIndex: 1 as number ,
    pageSize: undefined as number | undefined
  };
  this.searchCustomers();
}


getCustomerById(id:number){

  this._customerservice.getCustomerById(id).subscribe({
    next:(res)=>{
      console.log("edite Customer = res "+ res.data.id);

      this._customerservice.currentEditeCustomer=res.data
      console.log("edite Customer _customerservice.currentEditeCustomer = "+ this._customerservice.currentEditeCustomer.id);
      this._route.navigate(['/editeClient']);
    }

  
 
  })
  
}


getCustomerById_ShowDetails(id:number){

  this._customerservice.getCustomerById(id).subscribe({
    next:(res)=>{
      console.log("edite Customer = res "+ res.data.id);

      this._customerservice.currentShowCustomer=res.data
    //  console.log(" this._customerservice.currentShowCustomer = "+  this._customerservice.currentShowCustomer.id);
      this._route.navigate(['/showClient']);
    }

  
 
  })
  
}



gotoDeleteComponent(id:number){//is called when click the trash button   <i class="fas fa-trash"></i>
// set the customer id to be deleted  - 
this.isDeleted=0 //this means there is a customer is set to be deleted when == 0
this.deletedCustomer = id
console.log("deleted customers"+this.deletedCustomer)
}


softDelete(){

  console.log("this.isDeleted = " +this.isDeleted)
  console.log("this.deletedCustomer = " +this.deletedCustomer)
  this._customerservice.deleteCustomer(this.deletedCustomer).subscribe({

    next:(res)=>{
      console.log(res)
      this.isDeleted=-1
      this.deletedCustomer=-1
      this._ToastrService.info("تم مسح المشترك بنجاح" , "مسح مشترك")
    }
  })
this.clearFilter()
}


dontDelete(){

  console.log("this.isDeleted = " +this.isDeleted)
  console.log("this.deletedCustomer = " +this.deletedCustomer)
  this.isDeleted=-1
  this.deletedCustomer=-1
  console.log("this.isDeleted = " +this.isDeleted)
  console.log("this.deletedCustomer = " +this.deletedCustomer)


}

gotoAddClient(){
  this._route.navigate(['/addClient']);
}

incrementPDg(){

  if(this._Icustomerfilter.pageIndex <this.responsePages){ 
    this._Icustomerfilter.pageIndex=this._Icustomerfilter.pageIndex+1;
    this.navigatePaging(this._Icustomerfilter.pageIndex);}
 
}
decrementPDg(){
  if(this._Icustomerfilter.pageIndex >1){
    this._Icustomerfilter.pageIndex=this._Icustomerfilter.pageIndex-1;
    this.navigatePaging(this._Icustomerfilter.pageIndex);
  }
 
}

}
