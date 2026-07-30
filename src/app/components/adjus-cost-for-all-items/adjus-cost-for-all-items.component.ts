import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReportService } from '../../core/services/report.service';
import { LoadingControlService } from '../../core/services/loading-control.service';
import { CostAdjustmentStoreItem } from '../../core/interfaces/CostControl';
import { concatMap, finalize, from, tap } from 'rxjs';

@Component({
  selector: 'app-adjus-cost-for-all-items',
  standalone: true,
  imports: [],
  templateUrl: './adjus-cost-for-all-items.component.html',
  styleUrl: './adjus-cost-for-all-items.component.css'
})
export class AdjusCostForAllItemsComponent implements OnInit, OnDestroy {

 
 costList: CostAdjustmentStoreItem[] = [];
 totlaCountItmesAdjust:number=0
 completed:number =0
 progress = 0;
 emptyFlag:boolean=false
  constructor(
    private _reportService: ReportService,
    private _loadingControl: LoadingControlService
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
        finalize(() => this._loadingControl.enableLoadingInterceptor())
      ).subscribe({
        next: () => {},
        complete: () => {
          console.log('All items processed');
        },
        error: err => {
          console.error(err);
        }
      });

    }

    


  }
}
