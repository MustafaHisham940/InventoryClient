import { Component, inject } from '@angular/core';
import { AccountService } from '../../core/services/account.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../core/services/token.service';
import { ToastrService } from 'ngx-toastr';
import { of, switchMap } from 'rxjs';
import { SystemSettingsService } from '../../core/services/system-settings.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  /**
   *
   */
  private _ToastrService= inject(ToastrService)
  constructor( private _acountService:AccountService,
    private _router:Router,private _tokenService:TokenService , private _SettingService:SystemSettingsService
  ) {
    
    
  }

 _userName!:string 
 _Id!:string 
 _IsActive:boolean=false
 loginErr:boolean=false
  loginErrMessage:string=''


 /* login(){
    this._acountService.login(this._userName,this._Id).subscribe({
      next:(res)=>{
        this.loginErr=false
        console.log("Heyyyyyyy I amd " , res.token)
        sessionStorage.setItem('token' , res.data.token)
        sessionStorage.setItem('roles' , res.data.roles)
        
        if(sessionStorage.getItem('token') !=null ){
          if(String(this._tokenService.GetUSerStatus()).toLowerCase() == "true"){
          this._IsActive=false
          }else {   this._IsActive = true}
          this._router.navigate(['/home'])
        }
        this._ToastrService.success(`${res.data.displayName}` , "تم تسجيل الدخول بنجاح" ,
           {
          positionClass: 'toast-top-left'}
        )
      },
      error:(err)=>{
        this.loginErr =true
        console.log("Errrr" , err)
        this.loginErrMessage=err.error.message
      }
    })
  }*/

    login() {
      this._acountService.login(this._userName, this._Id).pipe(
        switchMap((loginRes) => {
          // Store login data
          this.loginErr = false;
          sessionStorage.setItem('token', loginRes.data.token);
          sessionStorage.setItem('roles', loginRes.data.roles);
          
          // Call settings API
          return this._SettingService.GetSystemServices().pipe(
            switchMap((settingRes) => {
              // Store settings
              console.log("settingRessettingRes" ,settingRes )
              sessionStorage.setItem("invoice_Mode", settingRes.accptMinus);
              sessionStorage.setItem("store_Mode", "2");
              sessionStorage.setItem("storeCode", "inv20");
              sessionStorage.setItem("storeName", "مخزن السلام");
              sessionStorage.setItem("AcceptMinus" , settingRes.accptMinus)
              
              // Return just the login response for toast
              return of(loginRes);
            })
          );
        })
      ).subscribe({
        next: (loginRes) => {
          // This runs after BOTH APIs complete
          if (sessionStorage.getItem('token') != null) {
            if (String(this._tokenService.GetUSerStatus()).toLowerCase() == "true") {
              this._IsActive = false;
            } else { 
              this._IsActive = true;
            }
            this._router.navigate(['/home']);
          }
          
          this._ToastrService.success(
            `${loginRes.data.displayName}`, 
            "تم تسجيل الدخول بنجاح", 
            { positionClass: 'toast-top-left' }
          );
        },
        error: (err) => {
          this.loginErr = true;
          console.log("Error", err);
          this.loginErrMessage = err.error?.message || 'حدث خطأ أثناء تسجيل الدخول';
        }
      });
    }


  }
