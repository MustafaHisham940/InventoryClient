import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerServiceService } from '../../core/services/customer-service.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ICreateCustomerDto } from '../../core/interfaces/icustomer';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes-guard.guard';

@Component({
  selector: 'app-edite-customer',
  standalone: true,
  imports: [FormsModule , RouterModule,ReactiveFormsModule],
  templateUrl: './edite-customer.component.html',
  styleUrl: './edite-customer.component.css'
})
export class EditeCustomerComponent implements OnInit,CanComponentDeactivate{

  private readonly _ToastrService=inject(ToastrService)

  hereEditeCustomer!:ICreateCustomerDto
 
 
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


  
  constructor(private _customerservice:CustomerServiceService,
    private Actroute:ActivatedRoute,
    private route:Router
  ){

    this.hereEditeCustomer=this._customerservice.currentEditeCustomer
    this.ReturnMess=-1


  }
  

  ngOnInit(): void {
  
    //console.log("this._customerservice.currentEditeCustomer.id = " + this._customerservice.currentEditeCustomer.id)
      if(this._customerservice.currentEditeCustomer.id ==-1 ){
        this.route.navigate(['/customers']);
      }
    this.ReturnMess=-1
    this.hereEditeCustomer=this._customerservice.currentEditeCustomer
  if(this._customerservice.currentEditeCustomer){
    console.log(this._customerservice.currentEditeCustomer)
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

  
  editeClient(){
    console.log(this._customerservice.currentEditeCustomer)
    console.log("hereee"+this.addForm.value)
    console.log("iddddd"+this.hereEditeCustomer.id)


    this._customerservice.updateCustomer(this.hereEditeCustomer.id,this.addForm.value).subscribe({
      next:(res)=>{
        this.isSaved=true
        console.log(res.id)
        this._ToastrService.info(`تم تعديل بيانات العميل بنجاح` ," تعديل بيانات ");
        this.route.navigate(['/customers']);
         

      }
    })
  }
  


  gotoCustomerpg(){
  // this._route.navigate(['/editeClient']);
    this.route.navigate(['/customers']);

  }
}
