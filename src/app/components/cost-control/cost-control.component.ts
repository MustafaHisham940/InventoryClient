import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/services/report.service';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, switchMap, tap } from 'rxjs';
import { CostAdjustmentStoreItem } from '../../core/interfaces/CostControl';
import { SlidingNotificationComponent } from "../sliding-notification/sliding-notification.component";

@Component({
  selector: 'app-cost-control',
  standalone: true,
  imports: [CommonModule, FormsModule, SlidingNotificationComponent],
  templateUrl: './cost-control.component.html',
  styleUrl: './cost-control.component.css'
})
export class CostControlComponent implements OnInit{


  /**
   *
   */
  constructor(private _ReportService:ReportService ,private _ToastrService:ToastrService ) {
   
    
  }
  _categories:any
  ngOnInit(): void {
   this._ReportService.getAllItemsNeedAdjustCost().subscribe({
    next:(res)=>{
      this._categories=res
    }
   })
  }
  // Filter object
  _Icustomfilter = {
    catigoryID: '',
    catigoryName: '',
    sort: ''
  };

  // Sample data - replace with your actual data source
  /*_categories = {
    data: {
      data: [
        { id: 1, ctgName: 'Electronics' },
        { id: 2, ctgName: 'Clothing' },
        { id: 3, ctgName: 'Books' },
        { id: 4, ctgName: 'Home & Garden' },
        { id: 5, ctgName: 'Sports' },
        { id: 6, ctgName: 'Toys' },
        { id: 7, ctgName: 'Automotive' },
        { id: 8, ctgName: 'Health & Beauty' }
      ]
    }
  };*/




  pagesList = [1, 2, 3, 4, 5];

  searchCustomers() {
    console.log('Searching with filters:', this._Icustomfilter);
    // Implement your search logic here
  }

  clearFilter() {
    this._Icustomfilter = {
      catigoryID: '',
      catigoryName: '',
      sort: ''
    };
    console.log('Filters cleared');
  }

  showCtg(id: number) {
    console.log('Show category details:', id);
    // Implement view logic
  }

  getCustomerById(id: number, name: string) {
    console.log('Edit category:', id, name);
    // Implement edit logic
  }

  gotoDeleteComponent(id: number) {
    console.log('Delete category:', id);
    // Implement delete logic
  }

  gotoAddComponent() {
    console.log('Navigate to add component');
    // Implement navigation to add component
  }

  navigatePaging(page: number) {
    console.log('Navigate to page:', page);
    // Implement pagination logic
  }



   

  UpdateAllItemsNeedsCostControl() {
    this._ReportService.AdjustItemStoreCost().pipe(
  
      switchMap((res) => {
        console.log(res);
  
        if (res.isSuccess) {
          this._ToastrService.success(res.message, "ضبط التكلفة" , {
            positionClass:'toast-top-right'
          });
  
          // ✅ just return the observable
          return this._ReportService.getAllItemsNeedAdjustCost();
        }
  
        return EMPTY; // stop the chain
      })
  
    ).subscribe({
      next: (res2) => {
        console.log(res2);
  
        // ✅ handle result here
        this._categories = res2;
      }
    });
  }




 

  UpdateSpecificItem(_Strcd:string , _Itemcd:string) {

   let localData: CostAdjustmentStoreItem={
     ItemCd: _Itemcd,
     StrCd: _Strcd
   }
  
    this._ReportService.AdjustSpeceficStoreITemCost(localData).pipe(
  
      tap(res => {
        console.log(res);
  
        if (res.isSuccess) {
          this._ToastrService.success(res.message, "ضبط التكلفة", {
            positionClass: 'toast-top-right'
          });
        }
      }),
  
      switchMap(res => {
        if (res.isSuccess) {
          // ✅ second API call
          return this._ReportService.getAllItemsNeedAdjustCost();
        }
  
        return EMPTY; // stop if failed
      })
  
    ).subscribe({
      next: (res2) => {
        console.log(res2);
  
        // ✅ update UI
        this._categories = res2;
      }
    });
  
  }
  
}
