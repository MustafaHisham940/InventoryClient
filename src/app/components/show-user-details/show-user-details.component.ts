import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerServiceService } from '../../core/services/customer-service.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ICreateCustomerDto } from '../../core/interfaces/icustomer';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { AccountService } from '../../core/services/account.service';
import { UserData, Data } from '../../core/interfaces/iaccount';

@Component({
  selector: 'app-show-user-details',
  standalone: true,
  imports: [FormsModule , RouterModule,ReactiveFormsModule,MatTabsModule],
  templateUrl: './show-user-details.component.html',
  styleUrl: './show-user-details.component.css'
})
export class ShowUserDetailsComponent  implements OnInit {
  sentUserID: any
  hereEditeEntity:UserData={
    status: false,
    message: '',
    data: {
      displayName: '',
      address: {
        id: 0,
        fName: '',
        lName: '',
        city: '',
        street: '',
        country: '',
        appUserId: '',
        appUser: undefined
      },
      isActive: false,
      userSimpleId: 0,
      id: '',
      userName: '',
      normalizedUserName: '',
      email: '',
      normalizedEmail: '',
      emailConfirmed: false,
      passwordHash: '',
      securityStamp: '',
      concurrencyStamp: '',
      phoneNumber: '',
      phoneNumberConfirmed: false,
      twoFactorEnabled: false,
      lockoutEnd: undefined,
      lockoutEnabled: false,
      accessFailedCount: 0
    }
  }

  constructor(private _router:Router,
    private route:ActivatedRoute,
    private __accountService:AccountService
  ) {
    
  }

  
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(
      params=>{ this.sentUserID = params.get('_username')}
    )

    this.__accountService.getUserByID(this.sentUserID).subscribe({
      next:(res)=>{
        console.log("ressssssssssssssssss" , res)
        this.hereEditeEntity.data =res.data


        this.addForm.patchValue({                
          email : this.hereEditeEntity?.data.email.toString(),
          dsiplayName : this.hereEditeEntity?.data.displayName,
          phoneNumber : this.hereEditeEntity?.data.phoneNumber,
          
    
          userName : this.hereEditeEntity?.data.userName,
          fName : this.hereEditeEntity?.data.address.fName,
          lName : this.hereEditeEntity?.data.address.lName,
    
    
          city : this.hereEditeEntity?.data.address.city,
          street : this.hereEditeEntity?.data.address.street,
          country : this.hereEditeEntity?.data.address.country,
    
          
        })
      }
    })

    this.addForm.patchValue({                
      email : this.hereEditeEntity?.data.email.toString(),
      dsiplayName : this.hereEditeEntity?.data.displayName,
      phoneNumber : this.hereEditeEntity?.data.phoneNumber,
      

      userName : this.hereEditeEntity?.data.userName.toString(),
      fName : this.hereEditeEntity?.data.address.fName.toString(),
      lName : this.hereEditeEntity?.data.address.lName.toString(),


      city : this.hereEditeEntity?.data.address.city.toString(),
      street : this.hereEditeEntity?.data.address.street.toString(),
      country : this.hereEditeEntity?.data.address.country.toString(),

      
    })


    
    
  }




  addForm:FormGroup =new FormGroup({  
   
    userName :new FormControl(null,[Validators.required ,Validators.maxLength(50)]),       
    email :new FormControl(null,[Validators.required , Validators.email]),   
    dsiplayName :new FormControl(null,[Validators.required ,Validators.maxLength(50)]), 
  
  
  
    phoneNumber :new FormControl(null,[Validators.required ,Validators.pattern(/^01[0125][0-9]{8}$/)]),              
    fName :new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    lName :new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    city :new FormControl(null,[Validators.required , Validators.maxLength(50)]), 
    street :new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    country :new FormControl(null,[Validators.required , Validators.maxLength(50)]), 
    
  })


  editeUserData(){   

    console.log("form data" , this.addForm)
         }

}
