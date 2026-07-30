import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICreateCustomerDto } from '../../core/interfaces/icustomer';
import { CustomerServiceService } from '../../core/services/customer-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { subscribe } from 'diagnostics_channel';
import { nextTick } from 'process';
import { ToastrService } from 'ngx-toastr';
import { InputLimiterDirective } from '../../core/directives/input-limiter.directive';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [ReactiveFormsModule ,InputLimiterDirective],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.css'
})
export class AddClientComponent implements OnInit {

  constructor(private _customerservice:CustomerServiceService,
    private Actroute:ActivatedRoute,
    private route:Router
  ){}
  ngOnInit(): void {
    this.addForm.patchValue(
      {
        typ:"2",
        pst:"1"
      }
    )
  }

private _ToastrService=inject(ToastrService)
  _IcreateCustomer!:ICreateCustomerDto

  addForm:FormGroup =new FormGroup({
    id : new FormControl(null ,[Validators.required , Validators.pattern(/^\d{6}$/)]),
    cstNm :new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    addr : new FormControl(null ,[ Validators.required , Validators.maxLength(50)]),
    phon : new FormControl(null ,[Validators.required , Validators.pattern(/^01[0125][0-9]{8}$/)]),
    resp : new FormControl(null,[Validators.required , Validators.maxLength(50)]),  
    bBal : new FormControl(null ,[Validators.required , Validators.pattern(/^\d{1,15}(\.\d{1,3})?$/)]), //is it ok?
    typ : new FormControl(null,Validators.required),
    gov : new FormControl(null,[Validators.required , Validators.maxLength(10)]),
    mrkz : new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    taxId : new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    comId : new FormControl(null,[Validators.required ]),
    sec : new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    pst : new FormControl(null,Validators.required),
    bal : new FormControl(null,[Validators.required , Validators.pattern(/^\d{1,15}(\.\d{1,3})?$/)]),
    trst : new FormControl(null,[Validators.required , Validators.maxLength(10)])
  }
    
  )
  addClient(){


    console.log(this.addForm)
    this._customerservice.createCustomer(this.addForm.value).subscribe({
      next :(res)=>{
      console.log(res);
      
      this.route.navigate(['/customers']);
      this._ToastrService.success("تمت اضافة مشترك جديد بنجاح","اضاقة عميل" , {
        positionClass:'toast-top-left'
      })
       },


       error :(err)=>{
        console.log("Message ="+ err.error.message);
        console.log(err);
       }
    });
 

  }

  cancel(){
    console.log(this.addForm)
    this.route.navigate(['/customers']);
  }
}
