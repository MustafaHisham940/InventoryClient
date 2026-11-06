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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DdMmYyyyDateAdapter, DD_MM_YYYY_FORMATS } from '../../core/date-adapters/dd-mm-yyyy-date-adapter';
import { CustomerPickerComponent } from '../customer-picker/customer-picker.component';


@Component({
  selector: 'app-checkup-bal',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerPickerComponent, MatDatepickerModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DdMmYyyyDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMATS },
  ],
  templateUrl: './checkup-bal.component.html',
  styleUrl: './checkup-bal.component.css'
})
export class CheckupBalComponent {

    onEditButtonClicked() {
  //    this.gotoAddClient()
    }
    pdfUrl?: SafeResourceUrl;

    cstIdText: string = '';
    customerName: string = '';
    customerCodeTouched: boolean = false;

    onCustomerPicked(selection: { customerCode: string, customerName: string }): void {
      this.cstIdText = selection.customerCode;
      this.customerName = selection.customerName;
      this._Icustomfilter.specs.cstId = /^\d+$/.test(selection.customerCode) ? Number(selection.customerCode) : undefined;
      this.customerCodeTouched = true;
    }

    /* dd/mm/yyyy date pickers - see DdMmYyyyDateAdapter for why this is needed
     * instead of native <input type="date"> (its display format ignores `lang`
     * and just follows OS/browser locale). Picker works with Date objects; the
     * model fields stay the same ISO yyyy-mm-dd strings the report API expects. */
    startDateObj: Date | null = null;
    endDateObj: Date | null = null;

    private dateToIso(date: Date): string {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }

    onStartDateObjChange(date: Date | null): void {
      this._Icustomfilter.specs.startDate = date ? this.dateToIso(date) : '';
    }

    onEndDateObjChange(date: Date | null): void {
      this._Icustomfilter.specs.endDate = date ? this.dateToIso(date) : '';
    }

    
      __iItems: IItems= { data: [] } as any;
      responsePages!:number
      pagesList: number[] = []
      isDeleted!:number
      deletedCustomer!:string
  
      ExcelReportFlag:number=-1
      private _ToastrService=inject(ToastrService)
       
     // _Icustomerfilter!:Icustomerfilter 
    
      _Icustomfilter:ICheckupBalRep = {
        specs:{
          cstId:0||undefined,
          startDate:"",
          endDate:"",
          sort:"",
          pageSize: 999999,
          pageIndex: 1,
        },
        sysInfo: {
          accptMinus: 0,
          multiStore: false,
          singleStrCd:"",
          companyName:"",
          storeName:""
        }
      };
    
    
    
      constructor(private _itemsService:ItemsServiceService,
        private Actroute:ActivatedRoute,
        private _route:Router,
        private reportService: ReportService,
    private sanitizer: DomSanitizer,
    private _HDetailsService:HDetailsService
      ){
        this.isDeleted=-1
        this.deletedCustomer=""
      }
    
    
      ngOnInit(): void {
        console.log ("Fuckkkkkkkkkkkkkk!!!!!!!!!!!!!!!!!!!!!!!!! omgmmgmgmgmgmgm")
        this.isDeleted=-1 // no element is set to be deleted
        this.deletedCustomer="" // the id of customer is to be deleted is null
        this._Icustomfilter.specs.pageIndex=1;
        this._Icustomfilter.specs.pageSize=100;
       
     }
    
     
    
     searchCustomers() {
      console.log("hereeeeeeeeeeeeeeeeee>>>>>>>>"+this._Icustomfilter.specs);
      this._Icustomfilter.specs.pageIndex=1;
      this._HDetailsService.GetHeadersData_Report(this._Icustomfilter)
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
    if (!this.validateSearchInputs()) {
      return;
    }
    this._HDetailsService.GetHeadersData_Report(this._Icustomfilter)
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
  
  private validateSearchInputs(): boolean {
    if (this.hasCustomerCodeError()) {
      this._ToastrService.warning('كود العميل حقل إجباري');
      return false;
    }

    if (this.hasDateRequiredError()) {
      this._ToastrService.warning('تاريخ البداية وتاريخ النهاية حقول إجبارية');
      return false;
    }

    if (this.hasDateOrderError()) {
      this._ToastrService.warning('تاريخ البداية يجب أن يكون أقدم من تاريخ النهاية');
      return false;
    }

    return true;
  }

  hasCustomerCodeError(): boolean {
    const customerCode = this._Icustomfilter.specs.cstId;
    return customerCode === null || customerCode === undefined || `${customerCode}`.trim().length === 0;
  }

  hasDateRequiredError(): boolean {
    const { startDate, endDate } = this._Icustomfilter.specs;
    return !startDate || !endDate || startDate.trim().length === 0 || endDate.trim().length === 0;
  }

  hasDateOrderError(): boolean {
    const startDate = this._Icustomfilter.specs.startDate;
    const endDate = this._Icustomfilter.specs.endDate;
  
    if (!startDate || !endDate || startDate.trim().length === 0 || endDate.trim().length === 0) {
      return false;
    }
  
    return startDate > endDate;
  }



  downloadExcel() {
    this._HDetailsService.ExcelReport_GetHeadersData_Report(this._Icustomfilter).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ItemsReport.xlsx';
      a.click();  
      window.URL.revokeObjectURL(url);
    });
  }
  
    }
    
    
    
    /*****************************PAgination***************** */
    
    /*calculatePageNumber(){
      this.responsePages= Math.ceil(this.__iItems.count / this.__iItems.pageSize);
      
      console.log("pgIndx="+this.__iItems.pageIndex + "pgcount="+this.__iItems.count)
      console.log("Hhhhhhhhh =  "+this.responsePages)
     
    }
    */
    
   /* fillPagesList(){
      this.pagesList=[]
      for (let index = 0; index < this.responsePages; index++) {
         this.pagesList.push(index+1);
          console.log(this.pagesList)
      }
       
    }
    navigatePaging(pgIdx:number){
      this._Icustomfilter._pageIndex=pgIdx;
      console.log("currPage=" +this._Icustomfilter._pageIndex );
    
      this.searchCustomersNofill();
    }*/
    
    /*********************************** **********************/
    
   /* searchCustomersNofill() {
      console.log(this._Icustomfilter);
       
      this._itemsService.getFilteredItems(this._Icustomfilter).subscribe({
        next: (res) => {
          this.__iItems = res;
          console.log( this.__iItems);
          this.calculatePageNumber();
          
        },
    
        error: (err) => {
          console.error('Error fetching customers:', err);
        }
    
      });
    }*/
    
   
    
   /* getCustomerById(id:string){
    
      this._itemsService.getItemById(id).subscribe({
        next:(res)=>{
          console.log("edite Customer = res "+ res.data.id);
    
          this._itemsService.currentEditeItem=res.data
          console.log("edite Customer _customerservice.currentEditeCustomer = "+ this._itemsService.currentEditeItem.id);
          this._route.navigate(['/itemdedite']);
        }
    
      
     
      })
      
    }*/
    
    
   /* getCustomerById_ShowDetails(id:string){
    
      this._itemsService.getItemById(id).subscribe({
        next:(res)=>{
          console.log("edite Customer = res "+ res.data.id);
    
          this._itemsService.currentShowItem=res.data
        //  console.log(" this._customerservice.currentShowCustomer = "+  this._customerservice.currentShowCustomer.id);
          this._route.navigate(['/itemdetails']);
        }
    
      
     
      })
      
    }*/
    
    
    
    /*gotoDeleteComponent(id:string){
    // set the customer id to be deleted  - 
    this.isDeleted=0 //this means there is a customer is set to be deleted when == 0
    this.deletedCustomer = id
    console.log("deleted customers"+this.deletedCustomer)
    }*/
    
    
  /*  softDelete(){
    
      console.log("this.isDeleted = " +this.isDeleted)
      console.log("this.deletedCustomer = " +this.deletedCustomer)
      this._itemsService.deleteItem(this.deletedCustomer).subscribe({
    
        next:(res)=>{
          console.log(res)
          this.isDeleted=-1
          this.deletedCustomer=""
          this._ToastrService.info("تم مسح المنتج بنجاح" , "مسح منتج")
        }
        
      })
    this.clearFilter()
    }*/
    
    
  /*  dontDelete(){
    
      console.log("this.isDeleted = " +this.isDeleted)
      console.log("this.deletedCustomer = " +this.deletedCustomer)
      this.isDeleted=-1
      this.deletedCustomer=""
      console.log("this.isDeleted = " +this.isDeleted)
      console.log("this.deletedCustomer = " +this.deletedCustomer)
    
    
    }*/
    
   /* gotoAddClient(){
      this._route.navigate(['/itemsadd']);
    }*/
  
  
        


