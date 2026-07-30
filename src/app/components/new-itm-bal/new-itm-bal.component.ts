import { Component,  inject, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StoresService } from '../../core/services/stores.service';
import { stores } from '../../core/interfaces/Stores';
import { ItemsServiceService } from '../../core/services/items-service.service';
import { IItems, item } from '../../core/interfaces/iitem';
import { ItemBalanceServiceService } from '../../core/services/item-balance-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InputLimiterDirective } from '../../core/directives/input-limiter.directive';

@Component({
  selector: 'app-new-itm-bal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,    
    CommonModule,InputLimiterDirective
  ],
  templateUrl: './new-itm-bal.component.html',
  styleUrl: './new-itm-bal.component.css'
})
export class NewItmBalComponent implements OnInit {


  constructor(private _StoresService:StoresService,
    private _ItemsServiceService:ItemsServiceService,
    private _ItemBalanceServiceService:ItemBalanceServiceService,private _router:Router,private toastr:ToastrService
  ) {
    
  }
 currStore:any

  
  ngOnInit()  {
  
    const navigationState = history.state;
    if (navigationState && navigationState.data) {
      this.currStore = navigationState.data.store_id;
      console.log("Received data: ", this.currStore);
    }

    this._ItemsServiceService.getFilteredItems(this.iItemsearch).subscribe({
      next:(res)=>{
        this._iItems = res
        console.log("this._iItems.count  = " + this._iItems.count)
        this.mathCiel =Math.ceil(this._iItems.count / this.pageSize) 

        console.log(this.mathCiel)

        this.totalItems = this._iItems.count;

      }
    })
   // this.mathCiel =Math.ceil(this._iItems.count / this.pageSize) 
  
   
  }


  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: [null, Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    ItemId: ['', Validators.required],
    _IdNameSearch:['',],
    _itmNameSearch:['',],
    _BarCodeSearch:['',]

  });

  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: [null, Validators.required],
  })
  isLinear = false;

  iItemsearch={
    "_IdName":'' as string|undefined|null,
    "_itmName": '' as string | undefined|null,
    "_BarCode":'' as string | undefined|null,
    "pageSize":5,    
    "pageIndex": undefined as number | undefined
  }


  _iItems!:IItems
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
    this.iItemsearch._IdName= this.secondFormGroup.get('_IdNameSearch')?.value
    this.iItemsearch._itmName=this.secondFormGroup.get('_itmNameSearch')?.value
    this.iItemsearch._BarCode=this.secondFormGroup.get('_BarCodeSearch')?.value

    this._ItemsServiceService.getFilteredItems(this.iItemsearch).subscribe({
      next:(res)=>{
       this.totalItems = res.count;
        this._iItems = res
         
      }
    })
  }


  clearFilters(){
    this. iItemsearch={
      "_IdName":'' as string|undefined|null,
      "_itmName": '' as string | undefined|null,
      "_BarCode":'' as string | undefined|null,
      "pageSize":3,    
      "pageIndex": undefined as number | undefined
    }

    

    this.secondFormGroup.get('_IdNameSearch')?.setValue("")
    this.secondFormGroup.get('_itmNameSearch')?.setValue("")
    this.secondFormGroup.get('_BarCodeSearch')?.setValue("")


    this._ItemsServiceService.getFilteredItems(this.iItemsearch).subscribe({
      next:(res)=>{
       this.totalItems = res.count;
        this._iItems = res
         
      }
    })
  }


  DisplayItems(){
    console.log("firstCtrl = ",this.firstFormGroup.get('firstCtrl')?.value)

    console.log("ItemId = ",this.secondFormGroup.get('ItemId')?.value)
    console.log("_IdNameSearch = ",this.secondFormGroup.get('_IdNameSearch')?.value)
    console.log("_itmNameSearch = ",this.secondFormGroup.get('_itmNameSearch')?.value)
    console.log("_BarCodeSearch = ",this.secondFormGroup.get('_BarCodeSearch')?.value)

    console.log("thirdCtrl = ",this.thirdFormGroup.get('thirdCtrl')?.value)


  }


  addItemBalance(){
    const newBalance={
      "bCd":this.currStore,
      "itmCd":this.secondFormGroup.get('ItemId')?.value,
      "bBal":this.thirdFormGroup.get('thirdCtrl')?.value,
      "rOrdr":this.firstFormGroup.get('firstCtrl')?.value
      }
    if(newBalance.bCd != null && newBalance.itmCd !=null && newBalance.bBal!=null ){
      this._ItemBalanceServiceService.AddNewBalance(newBalance).subscribe({
        next:(res)=>{
          console.log(res)
          this._router.navigate(['/ItemBalance'])
          this.toastr.info("اضافة رصيد" , "تم اضافة الرصيد بنجاح",{
           // positionClass:"toast-"
          })
          
    const data={store_id:this.currStore}
    this._router.navigate(['/ItemBalance'] , {state:{data:data}})
          
        }
      })

    }
  }


}
