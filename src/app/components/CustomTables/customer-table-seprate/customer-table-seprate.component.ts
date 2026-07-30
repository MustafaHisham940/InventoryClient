import { Component,  inject, OnInit ,  Output, EventEmitter, model} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StoresService } from '../../../core/services/stores.service';
import { stores } from '../../../core/interfaces/Stores';
import { ItemsServiceService } from '../../../core/services/items-service.service';
import { IItems, item } from '../../../core/interfaces/iitem';
import { ItemBalanceServiceService } from '../../../core/services/item-balance-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InputLimiterDirective } from '../../../core/directives/input-limiter.directive';
import { CustomerServiceService } from '../../../core/services/customer-service.service';
import { customer, Icustomer } from '../../../core/interfaces/icustomer';

@Component({
  selector: 'app-customer-table-seprate',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule,],
  templateUrl: './customer-table-seprate.component.html',
  styleUrl: './customer-table-seprate.component.css'
})
export class CustomerTableSeprateComponent  implements OnInit{
S_parentParent_selectedCustomerName() {
throw new Error('Method not implemented.');
}
S_parentParent_selectedCustomer() {
throw new Error('Method not implemented.');
}

  @Output()  CustomerOutputID = new EventEmitter<any>();

  selectedItem!:customer

  onItemSelected(item: customer): void {
    this.selectedItem = item;       
    // Emit immediate selection change
    this.CustomerOutputID.emit(item);
    //this.Var_M_SelectedCustomer=item.id
    //this.Var_M_SelectedCustomerName=item.cstNm
    //this.M_SelectedCustomer.set(item.id)
    //this.M_SelectedCustomerNaem.set(this.Var_M_SelectedCustomerName)
    console.log(" this.selectedItem", this.selectedItem)
    // You can also emit the full item if needed
   // this.itemSelected.emit(item);
  }




  M_SelectedCustomer=model<number>()
  M_SelectedCustomerNaem=model<string>()
 Var_M_SelectedCustomer:any
 Var_M_SelectedCustomerName:any
  constructor( 
    private _CustomerServiceService:CustomerServiceService,
  ) {
      
  }
 currStore:any

  
  ngOnInit()  {
  
    const navigationState = history.state;
    if (navigationState && navigationState.data) {
      this.currStore = navigationState.data.store_id;
      console.log("Received data: ", this.currStore);
    }

    this._CustomerServiceService.getAllCustomers(this.iItemsearch).subscribe({
      next:(res)=>{
        this._iItems = res
        console.log("this._iItems.count  = " + this._iItems.count)
        this.mathCiel =Math.ceil(this._iItems.count / this.pageSize) 

        console.log(this.mathCiel)

        this.totalItems = this._iItems.count;

      }
    })
  
   
  }


  private _formBuilder = inject(FormBuilder);

 

  secondFormGroup = this._formBuilder.group({
    ItemId: ['', Validators.required],
    _IdSearch:['' ,],
    _customerNameSearch:['',],
    _CustomerType:['',]

  });

 

  iItemsearch={
    Id: undefined as number | undefined,
    Name: '' as string | undefined,
    Type: '' as string|undefined,

    Gov: undefined as number | undefined,
    Mrkz: undefined as number | undefined,
    Address: '' as string | undefined,
    Pst: '' as string | undefined,
    Sort: '' as string | undefined,
    
    pageIndex: 1 as  number,
    pageSize: undefined as number | undefined
  }


  _iItems:Icustomer={
    pageSize: 0,
    pageIndex: 0,
    count: 0,
    data: []
  }
  data: any[] = [];
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  mathCiel:any
  onPageChange(newPage: number): void {
    this.mathCiel =Math.ceil(this.totalItems / this.pageSize) 
    this.currentPage = newPage;
    this.searchItem(this.currentPage)
    this.secondFormGroup.get('ItemId')?.setValue("")
  }




  searchItem(pgIdc:number){
    this.iItemsearch.pageIndex=pgIdc
    this.iItemsearch.Id= this.secondFormGroup.get('_IdSearch')?.value as number|undefined
    this.iItemsearch.Name=this.secondFormGroup.get('_customerNameSearch')?.value as string|undefined
    this.iItemsearch.Type=this.secondFormGroup.get('_CustomerType')?.value  as string | undefined

    console.log(this.iItemsearch.Id)
    console.log(this.iItemsearch.Name)
    console.log(this.iItemsearch.Type)

    console.log(this.secondFormGroup.get('_IdSearch')?.value )
    console.log(this.secondFormGroup.get('_customerNameSearch')?.value )
    console.log(this.secondFormGroup.get('_CustomerType')?.value )
    this._CustomerServiceService.getAllCustomers(this.iItemsearch).subscribe({
      next:(res)=>{
       this.totalItems = res.count;
    this.mathCiel =Math.ceil(this.totalItems / this.pageSize) 

       console.log(" this.totalItems =  " , this.totalItems )
        this._iItems = res
         
      }
    })
  }


  clearFilters(){
    this. iItemsearch={
      Id: undefined as number | undefined,
    Name: '' as string | undefined,
    Type: '' as string|undefined,

    Gov: undefined as number | undefined,
    Mrkz: undefined as number | undefined,
    Address: '' as string | undefined,
    Pst: '' as string | undefined,
    Sort: '' as string | undefined,
    
    pageIndex: 1 as  number,
    pageSize: undefined as number | undefined
    }

     

    this.secondFormGroup.get('_IdSearch')?.setValue("");
    this.secondFormGroup.get('_customerNameSearch')?.setValue("")
    this.secondFormGroup.get('_CustomerType')?.setValue("")


    this._CustomerServiceService.getAllCustomers(this.iItemsearch).subscribe({
      next:(res)=>{
       this.totalItems = res.count;
       this.mathCiel =Math.ceil(this.totalItems / this.pageSize) 
       this._iItems = res
         
      }
    })
  }


  DisplayItems(){
    //console.log("firstCtrl = ",this.firstFormGroup.get('firstCtrl')?.value)

    console.log("ItemId = ",this.secondFormGroup.get('ItemId')?.value)
    console.log("_IdNameSearch = ",this.secondFormGroup.get('_IdNameSearch')?.value)
    console.log("_itmNameSearch = ",this.secondFormGroup.get('_itmNameSearch')?.value)
    console.log("_BarCodeSearch = ",this.secondFormGroup.get('_BarCodeSearch')?.value)

   // console.log("thirdCtrl = ",this.thirdFormGroup.get('thirdCtrl')?.value)


  }


  

}