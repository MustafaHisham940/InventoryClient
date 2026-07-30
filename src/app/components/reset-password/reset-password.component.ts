import { Component, HostListener, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators ,AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { ICreateCustomerDto } from '../../core/interfaces/icustomer';
import { CustomerServiceService } from '../../core/services/customer-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes-guard.guard';



export function matchPasswords(passwordKey: string, confirmKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirm = group.get(confirmKey)?.value;

    return password === confirm ? null : { passwordsMismatch: true };
  };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports:[ReactiveFormsModule ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})



export class ResetPasswordComponent implements CanComponentDeactivate{

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
  constructor() {
    
    
  }
  private _router=inject(Router)

// In your component.ts file
passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  addForm:FormGroup =new FormGroup({
    userId : new FormControl(null ,[Validators.required  ]),
    newPassword :new FormControl(null,[Validators.required  ,Validators.pattern(this.passwordPattern)]),
    ConfirmPAss :new FormControl(null,[Validators.required  ]),
    
    
  },{ validators: matchPasswords('newPassword', 'ConfirmPAss') }



);


  addClient(){
    this._router.navigate(['/'])

    console.log(this.addForm)
  }




}
