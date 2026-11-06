import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReportService } from '../../core/services/report.service';
import { LoadingControlService } from '../../core/services/loading-control.service';
import { CostAdjustmentStoreItem } from '../../core/interfaces/CostControl';
import { ToastrService } from 'ngx-toastr';
import { concatMap, finalize, from, tap } from 'rxjs';

@Component({
  selector: 'app-adjus-cost-for-all-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adjus-cost-for-all-items.component.html',
  styleUrl: './adjus-cost-for-all-items.component.css'
})
export class AdjusCostForAllItemsComponent implements OnInit, OnDestroy {


 costList: CostAdjustmentStoreItem[] = [];
 totlaCountItmesAdjust:number=0
 completed:number =0
 progress = 0;
 emptyFlag:boolean=false
 isRunning:boolean=false
  constructor(
    private _reportService: ReportService,
    private _loadingControl: LoadingControlService,
    private _ToastrService: ToastrService
  ) {}

  ngOnDestroy(): void {
    this._loadingControl.enableLoadingInterceptor();
  }
  ngOnInit(): void {
   this._reportService.getAllItemsNeedAdjustCost().subscribe({
    next:(res)=>{
      this.costList=res
      this.totlaCountItmesAdjust=res.length
      if(this.totlaCountItmesAdjust==0){
        this.emptyFlag=true
      }
      console.log(this.costList)
      console.log(this.totlaCountItmesAdjust)
    }
   })


   
   
  }




  startAdjustment() {
    if(this.totlaCountItmesAdjust==0){
      this.emptyFlag=true
    }else{
      this.emptyFlag=false
      this.isRunning=true
      this.completed=0
      this.progress=0
      this._loadingControl.disableLoadingInterceptor();

      from(this.costList).pipe(
        concatMap(item => {

          const newItem: CostAdjustmentStoreItem = {
            ItemCd: (item as any).itmcd,
            StrCd: (item as any).strcd
          };

          console.log(newItem);

          return this._reportService.AdjustSpeceficStoreITemCost(newItem).pipe(
            tap(() => {
              this.completed++;

              this.progress = Math.round(
                (this.completed / this.costList.length) * 100
              );
            })
          );
        }),
        finalize(() => {
          this._loadingControl.enableLoadingInterceptor();
          this.isRunning=false;
        })
      ).subscribe({
        next: () => {},
        complete: () => {
          console.log('All items processed');
          this._ToastrService.success(
            `تم ضبط تكلفة ${this.completed} من ${this.totlaCountItmesAdjust} صنف بنجاح`,
            "ضبط التكلفة",
            { positionClass: 'toast-top-right' }
          );
        },
        error: err => {
          console.error(err);
          this._ToastrService.error(
            `توقف الضبط بعد ${this.completed} من ${this.totlaCountItmesAdjust} صنف`,
            "خطأ في ضبط التكلفة",
            { positionClass: 'toast-top-right' }
          );
        }
      });

    }




  }
}
