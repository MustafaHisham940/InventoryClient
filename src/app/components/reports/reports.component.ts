import { Component, inject } from '@angular/core';
import { IItems } from '../../core/interfaces/iitem';
import { ToastrService } from 'ngx-toastr';
import { ItemsServiceService } from '../../core/services/items-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { ReportService } from '../../core/services/report.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {

  onEditButtonClicked() {
    this.gotoAddClient()
  }
  pdfUrl?: SafeResourceUrl;
  
    __iItems: IItems= { data: [] } as any;
    responsePages!:number
    pagesList: number[] = []
    isDeleted!:number
    deletedCustomer!:string

    ExcelReportFlag:number=-1
    private _ToastrService=inject(ToastrService)
     
   // _Icustomerfilter!:Icustomerfilter 
  
    _Icustomfilter = {
     
     
      _idName: '' as string | undefined,
      _itmName: '' as string | undefined,
      _barCode: '' as string | undefined,
    
  
      _ctgId:'' as string | undefined,
      _sort: '' as string | undefined,
      _pageIndex: undefined as number | undefined,
      _pageSize: undefined as number | undefined
    };
  
  
  
    constructor(private _itemsService:ItemsServiceService,
      private Actroute:ActivatedRoute,
      private _route:Router,
      private reportService: ReportService,
  private sanitizer: DomSanitizer
    ){
      this.isDeleted=-1
      this.deletedCustomer=""
    }
  
  
    ngOnInit(): void {
      console.log ("Fuckkkkkkkkkkkkkk!!!!!!!!!!!!!!!!!!!!!!!!! omgmmgmgmgmgmgm")
      this.isDeleted=-1 // no element is set to be deleted
      this.deletedCustomer="" // the id of customer is to be deleted is null
      this._Icustomfilter._pageIndex=1;
      this._Icustomfilter._pageSize=100;
     /* this._itemsService.getFilteredItems(this._Icustomfilter).subscribe({
  
       next:(res)=>{
        
        this.__iItems=res
        
         console.log("Welcome!!!!!",res)
         this.calculatePageNumber();
         this.fillPagesList();
       }
      })*/
   }
  
   
  
   searchCustomers() {
    if (!this.validateMainSearchInputs()) {
      return;
    }
    console.log("hereeeeeeeeeeeeeeeeee>>>>>>>>"+this._Icustomfilter._ctgId);
    this._Icustomfilter._pageIndex=1;
    this._itemsService.getFilteredItems(this._Icustomfilter).subscribe({
      next: (res) => {
        this.__iItems = res;
        console.log( this.__iItems);
        this.calculatePageNumber();
        this.fillPagesList();
      },
  
      error: (err) => {
        console.error('Error fetching customers:', err);
      }
  
    });
  }
  
  
  
  /*****************************PAgination***************** */
  
  calculatePageNumber(){
    this.responsePages= Math.ceil(this.__iItems.count / this.__iItems.pageSize);
    
    console.log("pgIndx="+this.__iItems.pageIndex + "pgcount="+this.__iItems.count)
    console.log("Hhhhhhhhh =  "+this.responsePages)
   
  }
  
  
  fillPagesList(){
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
  }
  
  /*********************************** **********************/
  
  searchCustomersNofill() {
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
  }
  
  clearFilter(){
  
    this._Icustomfilter = {
      _idName: '' as string | undefined,
      _itmName: '' as string | undefined,
      _barCode: '' as string | undefined,
    
  
      _ctgId: '' as string | undefined,
      _sort: '' as string | undefined,
      _pageIndex: undefined as number | undefined,
      _pageSize: undefined as number | undefined
    };
    this.searchCustomers();
  }
  
  
  getCustomerById(id:string){
  
    this._itemsService.getItemById(id).subscribe({
      next:(res)=>{
        console.log("edite Customer = res "+ res.data.id);
  
        this._itemsService.currentEditeItem=res.data
        console.log("edite Customer _customerservice.currentEditeCustomer = "+ this._itemsService.currentEditeItem.id);
        this._route.navigate(['/itemdedite']);
      }
  
    
   
    })
    
  }
  
  
  getCustomerById_ShowDetails(id:string){
  
    this._itemsService.getItemById(id).subscribe({
      next:(res)=>{
        console.log("edite Customer = res "+ res.data.id);
  
        this._itemsService.currentShowItem=res.data
      //  console.log(" this._customerservice.currentShowCustomer = "+  this._customerservice.currentShowCustomer.id);
        this._route.navigate(['/itemdetails']);
      }
  
    
   
    })
    
  }
  
  
  
  gotoDeleteComponent(id:string){//is called when click the trash button   <i class="fas fa-trash"></i>
  // set the customer id to be deleted  - 
  this.isDeleted=0 //this means there is a customer is set to be deleted when == 0
  this.deletedCustomer = id
  console.log("deleted customers"+this.deletedCustomer)
  }
  
  
  softDelete(){
  
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
  }
  
  
  dontDelete(){
  
    console.log("this.isDeleted = " +this.isDeleted)
    console.log("this.deletedCustomer = " +this.deletedCustomer)
    this.isDeleted=-1
    this.deletedCustomer=""
    console.log("this.isDeleted = " +this.isDeleted)
    console.log("this.deletedCustomer = " +this.deletedCustomer)
  
  
  }
  
  gotoAddClient(){
    this._route.navigate(['/itemsadd']);
  }

  openPdfInline() {
    if (!this.validateMainSearchInputs()) {
      return;
    }
    this.reportService.getFilteredItemsReport(this._Icustomfilter).subscribe(
      blob => {
      const url = window.URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.ExcelReportFlag=1
      console.log(this._Icustomfilter,"===========>>>")}
    );

  }
  


  downloadExcel() {
    this.reportService.getFilteredItemsExcel(this._Icustomfilter).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ItemsReport.xlsx';
      a.click();  
      window.URL.revokeObjectURL(url);
    });
  }
 
  private isNullOrEmpty(value: string | undefined | null): boolean {
    return !value || value.trim().length === 0;
  }

  hasAnyMainSearchValue(): boolean {
    return !this.isNullOrEmpty(this._Icustomfilter._idName)
      || !this.isNullOrEmpty(this._Icustomfilter._itmName)
      || !this.isNullOrEmpty(this._Icustomfilter._barCode);
  }

  hasMainSearchError(): boolean {
    return !this.hasAnyMainSearchValue();
  }

  private validateMainSearchInputs(): boolean {
    if (this.hasMainSearchError()) {
      this._ToastrService.warning('يجب إدخال قيمة في حقل واحد على الأقل');
      return false;
    }

    return true;
  }

}
