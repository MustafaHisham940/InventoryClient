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
  selector: 'app-nav-to-item-bal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,    
    CommonModule,InputLimiterDirective
  ],
  templateUrl: './nav-to-item-bal.component.html',
  styleUrl: './nav-to-item-bal.component.css'
})
export class NavToItemBalComponent implements OnInit {

  constructor(private _StoresService:StoresService,
    private _ItemsServiceService:ItemsServiceService,
    private _ItemBalanceServiceService:ItemBalanceServiceService,private _router:Router,private toastr:ToastrService
  ) {
    
  }
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

  
  ngOnInit(): void {
 
    this._StoresService.GetAllStoresFiltered(this._iStoreFilters).subscribe({
      next:(res)=>{
        this._iStores=res
      }
    })

    
   
  }

  private _formBuilder = inject(FormBuilder);


  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  onSubmit(){
    console.log(this.firstFormGroup.value)
    
    const data={store_id:this.firstFormGroup.get('firstCtrl')?.value}
    console.log("data = " ,data)
    this._router.navigate(['/ItemBalance'] , {state:{data:data}})
  }
}
