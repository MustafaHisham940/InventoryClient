import { Component, HostListener, inject, OnInit, } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { stores } from '../../core/interfaces/Stores';
import { StoresService } from '../../core/services/stores.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputLimiterDirective } from "../../core/directives/input-limiter.directive";
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes-guard.guard';

@Component({
  selector: 'app-edite-store',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, InputLimiterDirective],
  templateUrl: './edite-store.component.html',
  styleUrl: './edite-store.component.css'
})
export class EditeStoreComponent implements OnInit,CanComponentDeactivate{

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
  _currStoreId: any
  filter: Object | undefined
  currStoreObj:stores | undefined
  constructor(private _storesService:StoresService
    ,private _router:Router
    ,private _Activeroute: ActivatedRoute,
   
  ) {  
      
  }
  ngOnInit(): void {
    this._currStoreId=this._Activeroute.snapshot.queryParamMap.get('id');
    this.filter  = {"_strCd": this._currStoreId};
    this._storesService.GetAllStoresFiltered(this.filter).subscribe({
      next:(res)=>{
        this.currStoreObj = res

        this.addForm.patchValue({
          strNm:res.data[0].strNm,
          pNam:res.data[0].pNam
        })
      }
    })
  }

     private _toastrService=inject(ToastrService)
  addForm:FormGroup =new FormGroup({
    strNm : new FormControl(null ,[ Validators.required , Validators.maxLength(50)]),
    pNam : new FormControl(null ,[ Validators.required , Validators.maxLength(50)]) 
  })
  

  





  addITem() {
     this._storesService.UpdateStoreData(this._currStoreId,this.addForm.value).subscribe(
      {
        next:()=>{
          this.isSaved=true
          this._toastrService.info("تمت تعديل بيانات المخزن بنجاح",
            "اضافة مخزن" ,{
              positionClass:'toast-top-left'
            }
          )
          this._router.navigate(['/Stores'])
          
        }
      }
     )
    }
}
