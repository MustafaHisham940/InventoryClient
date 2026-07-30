import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerServiceService } from '../../core/services/customer-service.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ICreateCustomerDto } from '../../core/interfaces/icustomer';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { ICreateItemDto } from '../../core/interfaces/iitem';
import { ItemsServiceService } from '../../core/services/items-service.service';

@Component({
  selector: 'app-items-show',
  standalone: true,
  imports: [FormsModule , RouterModule,ReactiveFormsModule,MatTabsModule],
  templateUrl: './items-show.component.html',
  styleUrl: './items-show.component.css'
})
export class ItemsShowComponent {

  hereEditeCustomer!:ICreateItemDto

  constructor(private _itemsservice:ItemsServiceService,
    private Actroute:ActivatedRoute,
    private route:Router
  ){

    this.hereEditeCustomer= this._itemsservice.currentShowItem
    this.ReturnMess=-1
  }
  ngOnInit(): void {
    //console.log("this._customerservice.currentEditeCustomer.id = " + this._customerservice.currentEditeCustomer.id)
      if( this._itemsservice.currentShowItem.id =="" ){
       // this.route.navigate(['/customers']);
      }
    this.ReturnMess=-1
    this.hereEditeCustomer=this._itemsservice.currentShowItem
  if(this._itemsservice.currentShowItem){
    console.log(this._itemsservice.currentShowItem)
   
   
   
    this.addForm.patchValue({
      
     

      id    : this.hereEditeCustomer?.id,
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
    
    id    :new FormControl(null,  ),
    itmNm  :new FormControl(null),
   
    bCst   :new FormControl(null), 
    lPrc  :new FormControl(null), 
    pric  :new FormControl(null), 
    mUnt  :new FormControl(null),
    back   :new FormControl(null),
    tax     :new FormControl(null), 
    barCod :new FormControl(null),
    gPrc     :new FormControl(null), 
    ctgId    :new FormControl(null),
    
  }
    


  
  )



  gotoCustomerpg(){
    // this._route.navigate(['/editeClient']);
      this.route.navigate(['/items']);
  
    }

}
