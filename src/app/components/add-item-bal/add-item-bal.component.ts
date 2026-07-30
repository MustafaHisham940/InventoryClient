import { Component,  HostListener,  inject, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { StoresService } from '../../core/services/stores.service';
import { stores } from '../../core/interfaces/Stores';
import { ItemsServiceService } from '../../core/services/items-service.service';
import { IItems, item } from '../../core/interfaces/iitem';
import { ItemBalanceServiceService } from '../../core/services/item-balance-service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InputLimiterDirective } from '../../core/directives/input-limiter.directive';
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes-guard.guard';


@Component({
  selector: 'app-add-item-bal',
  standalone: true,
  imports: [MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule, MatIconModule,CommonModule,InputLimiterDirective ],
  templateUrl: './add-item-bal.component.html',
  styleUrl: './add-item-bal.component.css',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },]
})
export class AddItemBalComponent implements OnInit,CanComponentDeactivate {
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
  /**
   *
   */
  constructor(private _StoresService:StoresService,
    private _ItemsServiceService:ItemsServiceService,
    private _ItemBalanceServiceService:ItemBalanceServiceService,private _router:Router,private toastr:ToastrService
  ) {
    
  }
  _iStoreFilters={
    "_strCd":'' as string | undefined,
    "_StrNm" : '' as string | undefined,
  }
  _iStores!:stores 

  
  ngOnInit(): void {
 
    this._StoresService.GetAllStoresFiltered(this._iStoreFilters).subscribe({
      next:(res)=>{
        this._iStores=res
      }
    })

    this._ItemsServiceService.getFilteredItems(this.iItemsearch).subscribe({
      next:(res)=>{
        this._iItems = res
        console.log("this._iItems.count  = " + this._iItems.count)
        this.mathCiel =Math.ceil(this._iItems.count / this.pageSize) 

        console.log(this.mathCiel)

        this.totalItems = this._iItems.count;

      }
    })
    this.mathCiel =Math.ceil(this._iItems.count / this.pageSize) 
  this.fourthForm.patchValue({
    iQty:0,
    oQty:0
  })
   
  }


  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    ItemId: ['', Validators.required],
    _IdNameSearch:['',],
    _itmNameSearch:['',],
    _BarCodeSearch:['',]

  });

  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
    
  })

  fourthForm = this._formBuilder.group({
    iQty: [0],
    oQty:[0]    
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
      "bCd":this.firstFormGroup.get('firstCtrl')?.value,
      "itmCd":this.secondFormGroup.get('ItemId')?.value,
      "bBal":this.thirdFormGroup.get('thirdCtrl')?.value,
      
      }
    if(newBalance.bCd != null && newBalance.itmCd !=null && newBalance.bBal!=null ){
      this._ItemBalanceServiceService.AddNewBalance(newBalance).subscribe({
        next:(res)=>{
          this.isSaved=true
          console.log(res)
          this._router.navigate(['/ItemBalance'])
          this.toastr.info("اضافة رصيد" , "تم اضافة الرصيد بنجاح")
          
        }
      })

    }
  }


}
