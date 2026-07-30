import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerServiceService } from '../../core/services/customer-service.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ICreateCustomerDto } from '../../core/interfaces/icustomer';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { ICreateItemDto } from '../../core/interfaces/iitem';
import { ItemsServiceService } from '../../core/services/items-service.service';
import { ToastrService } from 'ngx-toastr';
import { InputLimiterDirective } from '../../core/directives/input-limiter.directive';
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes-guard.guard';



@Component({
  selector: 'app-items-edite',
  standalone: true,
  imports: [FormsModule , RouterModule,ReactiveFormsModule,MatTabsModule , InputLimiterDirective],
  templateUrl: './items-edite.component.html',
  styleUrl: './items-edite.component.css'
})
export class ItemsEditeComponent implements CanComponentDeactivate {
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



  hereEditeCustomer!:ICreateItemDto
private _ToastrService=inject(ToastrService)
  constructor(private _itemsservice:ItemsServiceService,
    private Actroute:ActivatedRoute,
    private route:Router
  ){

    this.hereEditeCustomer= this._itemsservice.currentEditeItem
    this.ReturnMess=-1
  }
  ngOnInit(): void {
    //console.log("this._customerservice.currentEditeCustomer.id = " + this._customerservice.currentEditeCustomer.id)
      if( this._itemsservice.currentEditeItem.id =="" ){
       // this.route.navigate(['/customers']);
      }
    this.ReturnMess=-1
    this.hereEditeCustomer=this._itemsservice.currentEditeItem
  if(this._itemsservice.currentEditeItem){
    console.log(this._itemsservice.currentEditeItem)
   
   
   
    this.addForm.patchValue({
      
     

     
      itmNm : this.hereEditeCustomer?.itmNm.toString(),
      bCst  : this.hereEditeCustomer?.bCst,
      lPrc  : this.hereEditeCustomer?.lPrc,
      pric  : this.hereEditeCustomer?.pric,
      mUnt  : this.hereEditeCustomer?.mUnt,
      back  :  this.hereEditeCustomer?.back,
      tax   : this.hereEditeCustomer?.tax,
      barCod: this.hereEditeCustomer?.barCod,
      gPrc  : this.hereEditeCustomer?.gPrc,
      ctgId : this.hereEditeCustomer?.ctgId
      
      
    })
  }
   
  }


  _IcreateCustomer!:ICreateCustomerDto

  ReturnMess!:number


  addForm:FormGroup =new FormGroup({
    
    
    itmNm :new FormControl(null,[Validators.required , Validators.maxLength(60)]),
   
    bCst :new FormControl(null,[Validators.required ,Validators.pattern(/^\d{1,15}(\.\d{1,3})?$/)]), 
    lPrc :new FormControl(null,[Validators.required ,Validators.pattern(/^\d{1,15}(\.\d{1,3})?$/)]), 
    pric :new FormControl(null,[Validators.required ,Validators.pattern(/^\d{1,15}(\.\d{1,3})?$/)]), 
    mUnt :new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    back :new FormControl(null,[Validators.required , Validators.maxLength(100)]),
    tax :new FormControl(null,[Validators.required , Validators.pattern(/^\d{1,15}(\.\d{1,3})?$/)]), 
    barCod :new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    gPrc :new FormControl(null,[Validators.required , Validators.pattern(/^\d{1,15}(\.\d{1,3})?$/)]), 
    ctgId :new FormControl(null,[Validators.required , Validators.maxLength(100)]),
    
  })




  editeItem(){
    console.log("Edite Form >>>>>>" , this.addForm.value)
    this._itemsservice.updateItem(this.hereEditeCustomer.id , this.addForm.value).subscribe({
      next:(res)=>{
        console.log("res.data === ",res.data);
        this.isSaved=true
        this.route.navigate(['/items'])
        this._ToastrService.info("تم تعديل بيانات المنتج بنجاح" , "تعديل منتج")
      
      },
      error:(err)=>{
        console.log('from component ' , err)
      }
    })
  }

  gotoCustomerpg(){
    // this._route.navigate(['/editeClient']);
      this.route.navigate(['/items']);
  
    }

}
