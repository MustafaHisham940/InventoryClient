import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerServiceService } from '../../core/services/customer-service.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ICreateCustomerDto } from '../../core/interfaces/icustomer';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-show-client',
  standalone: true,
  imports: [FormsModule , RouterModule,ReactiveFormsModule],
  templateUrl: './show-client.component.html',
  styleUrl: './show-client.component.css'
})
export class ShowClientComponent {


  hereEditeCustomer!:ICreateCustomerDto

  constructor(private _customerservice:CustomerServiceService,
    private Actroute:ActivatedRoute,
    private route:Router
  ){

    this.hereEditeCustomer= this._customerservice.currentShowCustomer
    this.ReturnMess=-1
  }
  ngOnInit(): void {
    //console.log("this._customerservice.currentEditeCustomer.id = " + this._customerservice.currentEditeCustomer.id)
      if( this._customerservice.currentShowCustomer.id ==-1 ){
        this.route.navigate(['/customers']);
      }
    this.ReturnMess=-1
    this.hereEditeCustomer=this._customerservice.currentShowCustomer
  if(this._customerservice.currentShowCustomer){
    console.log(this._customerservice.currentShowCustomer)
    this.addForm.patchValue({
      
      cstNm :  this.hereEditeCustomer?.cstNm,
      addr :  this.hereEditeCustomer?.addr,
      phon :  this.hereEditeCustomer?.phon,
      resp :  this.hereEditeCustomer?.resp,
      bBal :  this.hereEditeCustomer?.bBal,
      typ :   this.hereEditeCustomer?.typ?.toString(),
      gov :  this.hereEditeCustomer?.gov,
      mrkz :  this.hereEditeCustomer?.mrkz,
      taxId : this.hereEditeCustomer?.taxId,
      comId : this.hereEditeCustomer?.comId,
      sec :   this.hereEditeCustomer?.sec,
      pst :  this.hereEditeCustomer?.pst?.toString(), 
      bal :   this.hereEditeCustomer?.bal,
      trst :  this.hereEditeCustomer?.trst
    })
  }
   
  }


  _IcreateCustomer!:ICreateCustomerDto

  ReturnMess!:number


  addForm:FormGroup =new FormGroup({
    
    cstNm :new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    addr : new FormControl(null ,[ Validators.required , Validators.maxLength(50)]),
    phon : new FormControl(null ,[Validators.required , Validators.pattern(/^01[0125][0-9]{8}$/)]),
    resp : new FormControl(null,[Validators.required , Validators.maxLength(50)]),  
    bBal : new FormControl(null ,[Validators.required , Validators.pattern(/^\d{1,15}(\.\d{1,3})?$/)]), //is it ok?
    typ : new FormControl(null,Validators.required),
    gov : new FormControl(null,[Validators.required , Validators.maxLength(10)]),
    mrkz : new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    taxId : new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    comId : new FormControl(null,[Validators.required , Validators.pattern(/^01[0125][0-9]{8}$/)]),
    sec : new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    pst : new FormControl(null,Validators.required),
    bal : new FormControl(null,[Validators.required , Validators.pattern(/^\d{1,15}(\.\d{1,3})?$/)]),
    trst : new FormControl(null,[Validators.required , Validators.maxLength(10)])
  }
    


  
  )



  gotoCustomerpg(){
    // this._route.navigate(['/editeClient']);
      this.route.navigate(['/customers']);
  
    }
}
