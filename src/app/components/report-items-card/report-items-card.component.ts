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
import { ItemPickerComponent } from '../item-picker/item-picker.component';
import { StoresService } from '../../core/services/stores.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../core/date-adapters/dd-mm-yyyy-date-adapter';


@Component({
  selector: 'app-report-items-card',
  standalone: true,
  imports: [FormsModule,CommonModule,ItemPickerComponent,MatDatepickerModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './report-items-card.component.html',
  styleUrl: './report-items-card.component.css'
})
export class ReportItemsCardComponent {

  selectedItemName: string = ''
  itemCodeTouched: boolean = false

  onItemPicked(selection: { itemCode: string, itemName: string }): void {
    this._Icustomfilter.specs.itmCd_search = selection.itemCode
    this.selectedItemName = selection.itemName
    this.itemCodeTouched = true
  }

  /*****************************dd/mm/yyyy date inputs*****************************
   * Native <input type="date"> displays according to the OS/browser locale, not the
   * page - confirmed on this machine it renders mm/dd/yyyy no matter what `lang` is
   * set on the element, and CSS can't touch a native picker's internal rendering.
   * MatDatepicker draws its own popup + formats text via Intl (see the custom
   * DdMmYyyyDateAdapter/DD_MM_YYYY_FORMATS), so the display is reliably dd/mm/yyyy
   * on every machine while still giving a real calendar popup. The picker itself
   * works with Date objects; _Icustomfilter.specs.startDate/endDate stays the same
   * ISO yyyy-mm-dd string it always was, since that's what hasDateOrderError()'s
   * `new Date(...)` comparisons and the report API expect.
   */
  startDateObj: Date | null = null
  endDateObj: Date | null = null
  startDateTouched: boolean = false
  endDateTouched: boolean = false

  private dateToIso(date: Date): string {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  onStartDateObjChange(date: Date | null): void {
    this.startDateTouched = true
    this._Icustomfilter.specs.startDate = date ? this.dateToIso(date) : ''
  }

  onEndDateObjChange(date: Date | null): void {
    this.endDateTouched = true
    this._Icustomfilter.specs.endDate = date ? this.dateToIso(date) : ''
  }

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
    storesList: { strCd: string, strNm: string }[] = []

    constructor(private _itemsService:ItemsServiceService,
      private Actroute:ActivatedRoute,
      private _route:Router,
      private reportService: ReportService,
  private sanitizer: DomSanitizer,
  private _HDetailsService:HDetailsService, private _TokenService:TokenService,
  private _StoresService:StoresService
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

    this._StoresService.GetStoresLookupList().subscribe({
      next:(res)=>{
        this.storesList = res.data
      }
    })


    
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
  