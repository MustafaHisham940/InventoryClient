import { Component, inject } from '@angular/core';
import { IItems } from '../../core/interfaces/iitem';
import { ToastrService } from 'ngx-toastr';
import { ItemsServiceService } from '../../core/services/items-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { ReportService } from '../../core/services/report.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ICheckupBalRep } from '../../core/interfaces/icheckup-bal-rep';
import { HeaderServiceService } from '../../core/header-service.service';
import { HDetailsService } from '../../core/hdetails.service';
import { TokenService } from '../../core/services/token.service';


@Component({
  selector: 'app-report-cost-control',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './report-cost-control.component.html',
  styleUrl: './report-cost-control.component.css'
})
export class ReportCostControlComponent {

  onEditButtonClicked() {
//    this.gotoAddClient()
  }
  pdfUrl?: SafeResourceUrl;
  private currentPdfObjectUrl?: string;
  
    __iItems: IItems= { data: [] } as any;
    responsePages!:number
    pagesList: number[] = []
    isDeleted!:number
    deletedCustomer!:string

    ExcelReportFlag:number=-1
    private _ToastrService=inject(ToastrService)
     
   // _Icustomerfilter!:Icustomerfilter 
  
    _Icustomfilter:any = {
      specs: {}
    };
  
  
  
    constructor(private _itemsService:ItemsServiceService,
      private Actroute:ActivatedRoute,
      private _route:Router,
      private reportService: ReportService,
  private sanitizer: DomSanitizer,
  private _HDetailsService:HDetailsService,private _TokenService:TokenService
    ){
      this.isDeleted=-1
      this.deletedCustomer=""
    }
    singleStoreCode:any
    singleStoreName:any
    multiStoreFlag:any

    ngOnInit(): void {
      console.log ("Fuckkkkkkkkkkkkkk!!!!!!!!!!!!!!!!!!!!!!!!! omgmmgmgmgmgmgm")
      this.isDeleted=-1 // no element is set to be deleted
      this.deletedCustomer="" // the id of customer is to be deleted is null
      this._Icustomfilter.specs.pageIndex=1;
      this._Icustomfilter.specs.pageSize=100;
     

      this.singleStoreCode=this._TokenService.GetUserStoreSettings()?.SingleStoreCode
      this.singleStoreName=this._TokenService.GetUserStoreSettings()?.SingleStoreName
      this.multiStoreFlag=this._TokenService.GetUserStoreSettings()?.MultiStore
     
   }
  
   
  
   searchCustomers() {
    if (!this.validateSearchInputs()) {
      return;
    }
    console.log("this.multiStoreFlag" , this.multiStoreFlag)

    if(this.multiStoreFlag == "False"){
      this._Icustomfilter.strCd=this._TokenService.GetUserStoreSettings()?.SingleStoreCode
    }
    console.log("hereeeeeeeeeeeeeeeeee>>>>>>>>"+this._Icustomfilter.specs);
    
    this.reportService.CostadjustmentSpeceficItemReport(this._Icustomfilter)
    .subscribe(blob => {
      if (this.currentPdfObjectUrl) {
        URL.revokeObjectURL(this.currentPdfObjectUrl);
      }

      const url = window.URL.createObjectURL(blob);
      this.currentPdfObjectUrl = url;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.ExcelReportFlag = 1;
    });
}
openPdfInline() {
  if (!this.validateSearchInputs()) {
    return;
  }
  this.reportService.CostadjustmentSpeceficItemReport(this._Icustomfilter)
  .subscribe(
    blob => {
      if (this.currentPdfObjectUrl) {
        URL.revokeObjectURL(this.currentPdfObjectUrl);
      }
      const url = window.URL.createObjectURL(blob);
      this.currentPdfObjectUrl = url;
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.ExcelReportFlag=1
      console.log(this._Icustomfilter,"===========>>>")}
  );

}
clearFilter(){
  
    
}

private isNullOrEmpty(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0;
}

hasItemCodeError(): boolean {
  return this.isNullOrEmpty(this._Icustomfilter.itemCd);
}

hasStoreCodeError(): boolean {
  return this.multiStoreFlag === 'True' && this.isNullOrEmpty(this._Icustomfilter.strCd);
}

hasSingleStoreCodeError(): boolean {
  return this.multiStoreFlag !== 'True' && this.isNullOrEmpty(this.singleStoreCode);
}

private validateSearchInputs(): boolean {
  if (this.hasItemCodeError()) {
    this._ToastrService.warning('كود المنتج حقل إجباري');
    return false;
  }

  if (this.hasStoreCodeError()) {
    this._ToastrService.warning('كود المخزن حقل إجباري');
    return false;
  }

  if (this.hasSingleStoreCodeError()) {
    this._ToastrService.warning('كود المخزن حقل إجباري');
    return false;
  }

  return true;
}
downloadExcel() {
  this.reportService.ExcelReport_CostadjustmentSpeceficItemReport(this._Icustomfilter).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ItemsReport.xlsx';
    a.click();  
    window.URL.revokeObjectURL(url);
  });
}


  }
  