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
import { ItemCheckUpRequest } from '../../core/interfaces/itemCheckup';
import { TokenService } from '../../core/services/token.service';
import { StoreTokenSettings } from '../../core/interfaces/StoreTokenSettings';


@Component({
  selector: 'app-report-items-card',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './report-items-card.component.html',
  styleUrl: './report-items-card.component.css'
})
export class ReportItemsCardComponent {

  onEditButtonClicked() {
//    this.gotoAddClient()
  }
  pdfUrl?: SafeResourceUrl;
  
    __iItems: IItems= { data: [] } as any;
    responsePages!:number
    pagesList: number[] = []
    isDeleted!:number
    deletedCustomer!:string
    CurStoerSettings:StoreTokenSettings={
      MultiStore: '',
      SingleStoreCode: '',
      SingleStoreName: '',
      AcceptMinus: ''
    }

    ExcelReportFlag:number=-1
    private _ToastrService=inject(ToastrService)
     
   // _Icustomerfilter!:Icustomerfilter 
  
    _Icustomfilter:ItemCheckUpRequest = {
      specs:{
        strCd_search: '',
        _TrsTy: 0,
        _TrsNo: 0,
        _LnNo: 0,
         
        _CstId: 0,
        itmCd_search: '',
        _Qty: 0,
        _Pric: 0,
        _BCd: 0,
        _Bck: 0,
        _ONo: 0,
        _GQty: 0,
        own_search: '',
        lUsr_search: '',
        
        _Cst: 0,
        _Sort: '',
        _pageIndex: 0,
        _pageSize: 0,
        startDate: '',
        endDate: ''
      },
      sysInfo: {
        accptMinus: 0,
        multiStore: false,
        singleStrCd:"",
        companyName:"",
        storeName:""
      }
    };
  
  
    singleStoreCode:string|undefined
    singleStoreName:string|undefined
    multiStoreFlag:string|undefined
  
    constructor(private _itemsService:ItemsServiceService,
      private Actroute:ActivatedRoute,
      private _route:Router,
      private reportService: ReportService,
  private sanitizer: DomSanitizer,
  private _HDetailsService:HDetailsService, private _TokenService:TokenService
    ){
      this.isDeleted=-1
      this.deletedCustomer=""
    }
  
  
    ngOnInit(): void {
      console.log ("Fuckkkkkkkkkkkkkk!!!!!!!!!!!!!!!!!!!!!!!!! omgmmgmgmgmgmgm")
      this.isDeleted=-1 // no element is set to be deleted
      this.deletedCustomer="" // the id of customer is to be deleted is null
      this._Icustomfilter.specs._pageIndex=1;
      this._Icustomfilter.specs._pageSize=100;

    this.singleStoreCode=this._TokenService.GetUserStoreSettings()?.SingleStoreCode
    this.singleStoreName=this._TokenService.GetUserStoreSettings()?.SingleStoreName
    this.multiStoreFlag=this._TokenService.GetUserStoreSettings()?.MultiStore


    
    console.log("MultiStore",this._TokenService.GetUserStoreSettings()?.MultiStore)
    console.log("SingleStoreName",this._TokenService.GetUserStoreSettings()?.SingleStoreName)
    console.log("SingleStoreCode",this._TokenService.GetUserStoreSettings()?.SingleStoreCode)
   }
  
   
  
   searchCustomers() {
    console.log("hereeeeeeeeeeeeeeeeee>>>>>>>>"+this._Icustomfilter.specs);
    this._Icustomfilter.specs._pageIndex=1;

    console.log("this.multiStoreFlag" , this.multiStoreFlag)
    if (this.multiStoreFlag == "False" && this.singleStoreCode != null ){
     this._Icustomfilter.specs.strCd_search=this.singleStoreCode
     console.log("this._Icustomfilter.specs.strCd_search=this.singleStoreCode" , this._Icustomfilter.specs.strCd_search)
    }
    this.reportService.getItemCheckUpReport(this._Icustomfilter)
    .subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ItemsReport.pdf';
      a.click();
      URL.revokeObjectURL(url);
    });
}
openPdfInline() {

  console.log("this.multiStoreFlag" , this.multiStoreFlag)
  if (this.multiStoreFlag == "False" && this.singleStoreCode != null ){
   this._Icustomfilter.specs.strCd_search=this.singleStoreCode
   console.log("this._Icustomfilter.specs.strCd_search=this.singleStoreCode" , this._Icustomfilter.specs.strCd_search)
  }
  this.reportService.getItemCheckUpReport(this._Icustomfilter)
  .subscribe(
    blob => {
      const url = window.URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.ExcelReportFlag=1
      console.log(this._Icustomfilter,"===========>>>")}
  );

}
clearFilter(){
  
    
}

hasItemCodeError(): boolean {
  return !this._Icustomfilter.specs.itmCd_search?.trim();
}

hasStoreCodeError(): boolean {
  return !this._Icustomfilter.specs.strCd_search?.trim();
}

hasSingleStoreCodeError(): boolean {
  return !this.singleStoreCode?.trim();
}

hasDateRequiredError(): boolean {
  return !this._Icustomfilter.specs.startDate?.trim() || !this._Icustomfilter.specs.endDate?.trim();
}

hasDateOrderError(): boolean {
  const start = this._Icustomfilter.specs.startDate?.trim();
  const end = this._Icustomfilter.specs.endDate?.trim();
  if (!start || !end) {
    return false;
  }

  return new Date(start) > new Date(end);
}

downloadExcel() {
  this.reportService.ExcelReport_getItemCheckUpReport(this._Icustomfilter).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ItemsReport.xlsx';
    a.click();  
    window.URL.revokeObjectURL(url);
  });
}






  }
  