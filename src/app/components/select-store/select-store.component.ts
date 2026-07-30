import { Component,  inject, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StoresService } from '../../core/services/stores.service';
import { storedata, stores } from '../../core/interfaces/Stores';
import { ItemsServiceService } from '../../core/services/items-service.service';
import { IItems, item } from '../../core/interfaces/iitem';
import { ItemBalanceServiceService } from '../../core/services/item-balance-service.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InputLimiterDirective } from '../../core/directives/input-limiter.directive';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-select-store',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule,
    CommonModule, InputLimiterDirective, RouterLink],
  templateUrl: './select-store.component.html',
  styleUrl: './select-store.component.css'
})
export class SelectStoreComponent    implements OnInit {

  constructor(private _StoresService:StoresService,
    private _ItemsServiceService:ItemsServiceService,
    private _ItemBalanceServiceService:ItemBalanceServiceService,private _router:Router,private toastr:ToastrService
    ,private _TokenService:TokenService
  ) {}
  _iStoreFilters={
    "_strCd":'' as string | undefined,
    "_StrNm" : '' as string | undefined,
  }
  _iStores: stores={
    pageSize: 0,
    pageIndex: 0,
    count: 0,
    totalCount: 0,
    data: []
  }

  cur_TrsTy!:number
  store_name!:string
  StoreDataSingleStore:storedata={
    strNm: '',
    pNam: '',
    id: ''
  }
  
  ngOnInit(): void {

    var StrSettings = this._TokenService.GetUserStoreSettings()
    const navigationSate= history.state
    if(navigationSate && navigationSate._TrsTy && navigationSate.dataType ==1 ){
      this.cur_TrsTy=navigationSate._TrsTy
      console.log(" this.cur_TrsTy = " , this.cur_TrsTy)
      console.log(" this.dataType = " , navigationSate.dataType)
    }else{
      this._router.navigate(['/home'])
    }
 

    console.log("sessionStorage.getItem(Store_Mode)" , sessionStorage.getItem("store_Mode"))

    if(StrSettings?.MultiStore=="False" ){ // if SingleStoreMode 
    
      this.StoreDataSingleStore.id=StrSettings.SingleStoreCode
      this.StoreDataSingleStore.strNm=StrSettings.SingleStoreName

      const data={
        store_id:this.StoreDataSingleStore ,      
        _TrsTy:this.cur_TrsTy,
        StateType:2
        }
      console.log("data = " ,data)
      console.log("data ==========> " ,data)
      this._router.navigate([this.getTargetRoute()] , {state:{data:data}})
    }
   else{
    this._StoresService.GetAllStoresFiltered(this._iStoreFilters).subscribe({
      next:(res)=>{
        this._iStores=res
      }
    })

   }
    
   
  }


  // TrsTy 22 (Expenses) and 24 (personalWithdrwal) have their own store-scoped screens
  // instead of /Transactions.
  private getTargetRoute(): string {
    if (this.cur_TrsTy === 22) {
      return '/ExpensesMain';
    }
    if (this.cur_TrsTy === 24) {
      return '/personalWithdrwalMain';
    }
    return '/Transactions';
  }

  sendStoreName(storename:string){
    this.store_name=storename
    console.log(" this.store_name", this.store_name)
  }
  private _formBuilder = inject(FormBuilder);


  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  onSubmit(){
    console.log(this.firstFormGroup.value)
    
    const data={
      store_id:this.firstFormGroup.get('firstCtrl')?.value ,      
      _TrsTy:this.cur_TrsTy,
      StateType:2
      }
    console.log("data = " ,data)
   this._router.navigate([this.getTargetRoute()] , {state:{data:data}})
  }
}
