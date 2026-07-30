import { Component, inject, OnInit } from '@angular/core';
import { CustomerServiceService } from '../../core/services/customer-service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Icustomer,Icustomerfilter } from '../../core/interfaces/icustomer';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ItemsServiceService } from '../../core/services/items-service.service';
import { IItems } from '../../core/interfaces/iitem';
import { NavbarHoverDirective } from '../../core/directives/navbar-hover.directive';
import { ToastrService } from 'ngx-toastr';
import { FixedButtonComponent } from "../fixed-button/fixed-button.component";
import { TranslateModule } from '@ngx-translate/core';
import { TruncatePipe } from '../../core/pipes/truncate.pipe';

 

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [FormsModule, RouterModule, NavbarHoverDirective, FixedButtonComponent,TranslateModule,TruncatePipe],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent {
onEditButtonClicked() {
  this.gotoAddClient()
}

  __iItems: IItems= { data: [] } as any;
  responsePages!:number
  pagesList: number[] = []
  isDeleted!:number
  deletedCustomer!:string
  private _ToastrService=inject(ToastrService)
   
 // _Icustomerfilter!:Icustomerfilter 

  _Icustomfilter = {
   
   
    _IdName: '' as string | undefined,
    _itmName: '' as string | undefined,
    _BarCode: '' as string | undefined,
  

    _CtgID:'' as string | undefined,
    Sort: '' as string | undefined,
    pageIndex: undefined as number | undefined,
    pageSize: undefined as number | undefined
  };



  constructor(private _itemsService:ItemsServiceService,
    private Actroute:ActivatedRoute,
    private _route:Router
  ){
    this.isDeleted=-1
    this.deletedCustomer=""
  }


  ngOnInit(): void {
    
    this.isDeleted=-1 // no element is set to be deleted
    this.deletedCustomer="" // the id of customer is to be deleted is null
    this._Icustomfilter.pageIndex=1;
    this._Icustomfilter.pageSize=5;
    this._itemsService.getFilteredItems(this._Icustomfilter).subscribe({

     next:(res)=>{
      
      this.__iItems=res
      
       console.log("Welcome!!!!!",res)
       this.calculatePageNumber();
       this.fillPagesList();
     }
    })
 }

 

 searchCustomers() {
  console.log("hereeeeeeeeeeeeeeeeee>>>>>>>>"+this._Icustomfilter._CtgID);
  this._Icustomfilter.pageIndex=1;
  this._itemsService.getFilteredItems(this._Icustomfilter).subscribe({
    next: (res) => {
      this.__iItems = res;
      console.log( this.__iItems);
      this.calculatePageNumber();
      this.fillPagesList();
    },

    error: (err) => {
      console.error('Error fetching customers:', err);
    }

  });
}



/*****************************PAgination***************** */

calculatePageNumber(){
  this.responsePages= Math.ceil(this.__iItems.count / this.__iItems.pageSize);
  
  console.log("pgIndx="+this.__iItems.pageIndex + "pgcount="+this.__iItems.count)
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
  this._Icustomfilter.pageIndex=pgIdx;
  console.log("currPage=" +this._Icustomfilter.pageIndex );

  this.searchCustomersNofill();
}

/*********************************** **********************/

searchCustomersNofill() {
  console.log(this._Icustomfilter);
   
  this._itemsService.getFilteredItems(this._Icustomfilter).subscribe({
    next: (res) => {
      this.__iItems = res;
      console.log( this.__iItems);
      this.calculatePageNumber();
      
    },

    error: (err) => {
      console.error('Error fetching customers:', err);
    }

  });
}

clearFilter(){

  this._Icustomfilter = {
    _IdName: '' as string | undefined,
    _itmName: '' as string | undefined,
    _BarCode: '' as string | undefined,
  

    _CtgID: '' as string | undefined,
    Sort: '' as string | undefined,
    pageIndex: undefined as number | undefined,
    pageSize: undefined as number | undefined
  };
  this.searchCustomers();
}


getCustomerById(id:string){

  this._itemsService.getItemById(id).subscribe({
    next:(res)=>{
      console.log("edite Customer = res "+ res.data.id);

      this._itemsService.currentEditeItem=res.data
      console.log("edite Customer _customerservice.currentEditeCustomer = "+ this._itemsService.currentEditeItem.id);
      this._route.navigate(['/itemdedite']);
    }

  
 
  })
  
}


getCustomerById_ShowDetails(id:string){

  this._itemsService.getItemById(id).subscribe({
    next:(res)=>{
      console.log("edite Customer = res "+ res.data.id);

      this._itemsService.currentShowItem=res.data
    //  console.log(" this._customerservice.currentShowCustomer = "+  this._customerservice.currentShowCustomer.id);
      this._route.navigate(['/itemdetails']);
    }

  
 
  })
  
}



gotoDeleteComponent(id:string){//is called when click the trash button   <i class="fas fa-trash"></i>
// set the customer id to be deleted  - 
this.isDeleted=0 //this means there is a customer is set to be deleted when == 0
this.deletedCustomer = id
console.log("deleted customers"+this.deletedCustomer)
}


softDelete(){

  console.log("this.isDeleted = " +this.isDeleted)
  console.log("this.deletedCustomer = " +this.deletedCustomer)
  this._itemsService.deleteItem(this.deletedCustomer).subscribe({

    next:(res)=>{
      console.log(res)
      this.isDeleted=-1
      this.deletedCustomer=""
      this._ToastrService.info("تم مسح المنتج بنجاح" , "مسح منتج")
    }
    
  })
this.clearFilter()
}


dontDelete(){

  console.log("this.isDeleted = " +this.isDeleted)
  console.log("this.deletedCustomer = " +this.deletedCustomer)
  this.isDeleted=-1
  this.deletedCustomer=""
  console.log("this.isDeleted = " +this.isDeleted)
  console.log("this.deletedCustomer = " +this.deletedCustomer)


}

gotoAddClient(){
  this._route.navigate(['/itemsadd']);
}



}
