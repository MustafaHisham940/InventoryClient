import { Component, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerServiceService } from '../../core/services/customer-service.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ICreateCustomerDto } from '../../core/interfaces/icustomer';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { AccountService } from '../../core/services/account.service';
import { UserData, Data } from '../../core/interfaces/iaccount';
import { ToastrService } from 'ngx-toastr';
import { InputLimiterDirective } from '../../core/directives/input-limiter.directive';
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes-guard.guard';


@Component({
  selector: 'app-add-new-user',
  standalone: true,
  imports:  [FormsModule , RouterModule,ReactiveFormsModule,MatTabsModule,InputLimiterDirective],
  templateUrl: './add-new-user.component.html',
  styleUrl: './add-new-user.component.css'
})
export class AddNewUserComponent implements CanComponentDeactivate {

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
  sentUserID: any
  private _ToastrService=inject(ToastrService)
  constructor(private _router:Router,
    private route:ActivatedRoute,
    private __accountService:AccountService
  ) {
    this.userAdded=false  
  }

  
  ngOnInit(): void {
    this.userAdded=false  
  }


  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  addForm:FormGroup =new FormGroup({  
   
    
    userName :new FormControl(null,[Validators.required ,Validators.maxLength(50)]),       
    _SimpleUserID :new FormControl(null,[Validators.required ,Validators.maxLength(10)]),       
    email :new FormControl(null,[Validators.required , Validators.email]),   
    dsiplayName :new FormControl(null,[Validators.required ,Validators.maxLength(50)]), 
    password :new FormControl(null,[Validators.required ,Validators.pattern(this.passwordPattern)]), 
  
  
  
    phoneNumber :new FormControl(null,[Validators.required ,Validators.pattern(/^01[0125][0-9]{8}$/)]),              
    fName :new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    lName :new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    city :new FormControl(null,[Validators.required , Validators.maxLength(50)]), 
    street :new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    country :new FormControl(null,[Validators.required , Validators.maxLength(50)]), 
    
  })

  userAdded:boolean=false


  createNewUser(){   

    this.__accountService.registerUser(this.addForm.value).subscribe({
      next:(res)=>{
        console.log("result" , res)
        this._ToastrService.success("تمت اضافة المستخدم بنجاح" , "اضافة مستخدم جديد")
        this.isSaved=true
        this._router.navigate(['/UserDetails'])         
      }
    })
    console.log("form data" , this.addForm)
 }

 gotoUserpage(){
  this._router.navigate(['/UserDetails'])}

}
