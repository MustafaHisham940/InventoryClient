import { Component, inject, } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { stores } from '../../core/interfaces/Stores';
import { StoresService } from '../../core/services/stores.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { InputLimiterDirective } from "../../core/directives/input-limiter.directive";

@Component({
  selector: 'app-add-store',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, InputLimiterDirective],
  templateUrl: './add-store.component.html',
  styleUrl: './add-store.component.css'
})
export class AddStoreComponent {

  /**
   *
   */
  constructor(private _storesService:StoresService
    ,private _router:Router
  ) {  
      
  }
  _ICreateStore:stores | undefined
     private _toastrService=inject(ToastrService)
  addForm:FormGroup =new FormGroup({
    strCd :new FormControl(null,[Validators.required , Validators.maxLength(50)]),
    strNm : new FormControl(null ,[ Validators.required , Validators.maxLength(50)]),
    pNam : new FormControl(null ,[ Validators.required , Validators.maxLength(50)]) 
  })



  addITem() {
     this._storesService.AddnewStore(this.addForm.value).subscribe(
      {
        next:()=>{
          this._toastrService.info("تمت اضافة المخزن بنجاح",
            "اضافة مخزن" ,{
              positionClass:'TopLeft'
            }
          )
          this._router.navigate(['/Stores'])
          
        }
      }
     )
    }

}
