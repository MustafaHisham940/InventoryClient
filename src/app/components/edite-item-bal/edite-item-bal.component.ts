import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ItemBalanceServiceService } from '../../core/services/item-balance-service.service';
import { itemBAlance } from '../../core/interfaces/itemBalance';
import { FormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { InputLimiterDirective } from '../../core/directives/input-limiter.directive';
import { CanComponentDeactivate } from '../../core/guards/unsaved-changes-guard.guard';



@Component({
  selector: 'app-edite-item-bal',
  standalone: true,
  imports: [FormsModule, InputLimiterDirective, RouterLink],
  templateUrl: './edite-item-bal.component.html',
  styleUrl: './edite-item-bal.component.css'
})
export class EditeItemBalComponent implements OnInit,CanComponentDeactivate{
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

  curr_BCd:any
  curr_ItmCd:any
  curr_bBal:any
 
 
  
   updatePArams ={
     _BCd:''as string|undefined,
     _ItmCd:'' as string|undefined,
     _pageSize: 1,
    _pageIndex: 1
   } 

   SendnewitemBal={
    _BCd:'' as string | undefined,
    _ItmCd: '' as string|undefined
  }

   curr_ItemBal!:itemBAlance


   newbalance={
    bCd:''as string|undefined,
    itmCd:''as string|undefined,
    bBal:undefined as number|undefined
  }

  constructor(private activeRoute:ActivatedRoute,
    private _itemBalanceServiceService:ItemBalanceServiceService,private _route:Router,private toastr:ToastrService
  ) {
    
  }
  ngOnInit(): void {
    const queryParams = this.activeRoute.snapshot.queryParams
    this.curr_BCd=queryParams['_BCd']
    this.curr_ItmCd=queryParams['_ItmCd']
   
     
    
    this.updatePArams={
      _BCd:  queryParams['_BCd'],
      _ItmCd:queryParams['_ItmCd'],
      _pageSize: 1,
      _pageIndex: 1
    }
    
    

    this._itemBalanceServiceService.GetAllBalancesFiltered(this.updatePArams).subscribe({
      next :(res)=>{
        console.log("resss ==>" ,res)
        this.curr_ItemBal= res
        this.newbalance.bBal = res.data[0].bBal
      }
    })
    
  }

  editeITemBal(){
    console.log("bBal = " , this.newbalance.bBal)
    this.SendnewitemBal._BCd=this.curr_BCd
    this.SendnewitemBal._ItmCd=this.curr_ItmCd
    this.newbalance.bCd=this.curr_BCd
    this.newbalance.itmCd=this.curr_ItmCd
   
    this._itemBalanceServiceService.updateItemBalance(this.SendnewitemBal, this.newbalance).subscribe({
      next:(res)=>{
        console.log(res)
        this.isSaved=true
        const data={store_id:this.curr_BCd}
        this._route.navigate(['/ItemBalance'] , {state:{data:data}})
        this.toastr.success(
          'Saved successfully!',
          'Success',
          {
            positionClass: 'toast-center-center',
            toastClass: 'ngx-toastr custom-toast',
        
            // Timer options
            timeOut: 4000,          // auto close after 4 sec
            extendedTimeOut: 1000,  // extra time on hover
            progressBar: true,
            progressAnimation: 'increasing',
        
            // Optional
            closeButton: true,
            tapToDismiss: true
          }
        );

      }
    })
  }
  
  goBack(){
    const data={store_id:this.curr_BCd}
    this._route.navigate(['/ItemBalance'] , {state:{data:data}})
  }

}
