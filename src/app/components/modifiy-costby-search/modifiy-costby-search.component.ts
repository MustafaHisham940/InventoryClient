import { Component } from '@angular/core';
import { ReportService } from '../../core/services/report.service';
import { CostAdjustmentStoreItem } from '../../core/interfaces/CostControl';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modifiy-costby-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modifiy-costby-search.component.html',
  styleUrl: './modifiy-costby-search.component.css'
})
export class ModifiyCostbySearchComponent {
 
constructor(private _ReportService:ReportService,
  private _ToastrService:ToastrService
) {
   
  
}

curItemCode:string|undefined
curStrCode:string|undefined


  UpdateSpecificItem(_Strcd:string , _Itemcd:string) {

    let localData: CostAdjustmentStoreItem={
      ItemCd: _Itemcd,
      StrCd: _Strcd
    }
   
     this._ReportService.AdjustSpeceficStoreITemCost(localData).subscribe({
      next:(res)=>{
        console.log(res)   
        this._ToastrService.success("تم ضبط التكلفة بنجاح" , "ضبط التكلفة")
      } 
     })
   
     
      
   
   }
   

}
