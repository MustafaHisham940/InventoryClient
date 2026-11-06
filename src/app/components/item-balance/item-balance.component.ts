import { Component, inject, OnInit } from '@angular/core';
import { CustomerServiceService } from '../../core/services/customer-service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Icustomer,Icustomerfilter } from '../../core/interfaces/icustomer';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { NavbarHoverDirective } from '../../core/directives/navbar-hover.directive';
import { ToastrService } from 'ngx-toastr';
import { FixedButtonComponent } from "../fixed-button/fixed-button.component";
import { TranslateModule } from '@ngx-translate/core';
import { FixedClickComponent } from "../fixed-click/fixed-click.component";
import { TruncatePipe } from '../../core/pipes/truncate.pipe';
import { ItemBalanceServiceService } from '../../core/services/item-balance-service.service';
import { itemBAlance } from '../../core/interfaces/itemBalance';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { stat } from 'fs';

@Component({
  selector: 'app-item-balance',
  standalone: true,
  imports: [FormsModule, RouterModule,
    NavbarHoverDirective, FixedButtonComponent,
     TranslateModule, FixedClickComponent,
   TruncatePipe],
  templateUrl: './item-balance.component.html',
  styleUrl: './item-balance.component.css'
})
export class ItemBalanceComponent implements OnInit{
  onEditButtonClicked() {
    this.gotoAddClient();
  }
    _itemBAlance: itemBAlance= {
      data: [],
      pageSize: 0,
      pageIndex: 0,
      count: 0,
      totalCount: 0
    }
    responsePages!:number
    pagesList: number[] = []
    isDeleted!:number
    deleted_bCd :string
    deleted_itmCd:string
    SelectedStore:any

    curPdgIdx!:number
    private _ToastrService=inject(ToastrService)
     
   // _Icustomerfilter!:Icustomerfilter 
  
   

    _Icustomerfilter= {
      _BCd: '' as string|undefined,
      _ItmCd: '' as string|undefined,
      _BBal: undefined as number | undefined,
      _IQty: undefined as number | undefined,
      _OQty: undefined as number | undefined,
      _ROrdr: undefined as number | undefined,
      _Cst: undefined as number | undefined,
      _sort: '' as string|undefined,
      _pageSize: 10,
      _pageIndex: 1
    };
  
  
  
    constructor(private _ItemBalanceServiceService:ItemBalanceServiceService,
      private Actroute:ActivatedRoute,
      private _route:Router , private http:HttpClient
    ){
      this.isDeleted=-1
     this. deleted_bCd ='' 
     this.deleted_itmCd=''
      this.curPdgIdx=1
    }
  
    _topItem: { itemCode?: string, itemName?: string, iQty?: number, oQty?: number, balance?: number } | null = null
    ngOnInit() {

      const navigationState =history.state
      if(navigationState && navigationState.data){
        this.SelectedStore = navigationState.data
        this._Icustomerfilter._BCd=this.SelectedStore.store_id
        console.log("navigationState = " , this.SelectedStore.store_id)

        this._ItemBalanceServiceService.getTopItemByIQty(this.SelectedStore.store_id).subscribe({
          next:(res)=>{
            this._topItem = res.data
          }
        })
      }else{
        this._route.navigate(['/ItemBalance'])
      }


      this.isDeleted=-1 // no element is set to be deleted
      this. deleted_bCd ='' 
      this.deleted_itmCd='' // the id of customer is to be deleted is null
      this._Icustomerfilter._pageIndex=1;
      this.curPdgIdx=1
      
      this._ItemBalanceServiceService.GetAllBalancesFiltered(this._Icustomerfilter).subscribe({
  
       next:(res)=>{
        
        this._itemBAlance=res
        
         console.log("Welcome!!!!!",res)
         this.calculatePageNumber();
         this.fillPagesList();
       }
      })
  
       
   }
  
   
  
   searchCustomers() {
    console.log(this._Icustomerfilter);
    this._Icustomerfilter._pageIndex=1;
    this.curPdgIdx=this._Icustomerfilter._pageIndex
    this._ItemBalanceServiceService.GetAllBalancesFiltered(this._Icustomerfilter).subscribe({
      next: (res) => {
        this._itemBAlance = res;
        console.log( this._itemBAlance);
        this.calculatePageNumber();
        this.fillPagesList();
      },
  
      error: (err) => {
        console.error('Error fetching customers:', err);
      }
  
    });
  }
  
  
  get showingFrom(): number {
    if(!this._itemBAlance.count) return 0;
    return (this._itemBAlance.pageIndex - 1) * this._itemBAlance.pageSize + 1;
  }

  get showingTo(): number {
    if(!this._itemBAlance.count) return 0;
    return Math.min(this._itemBAlance.pageIndex * this._itemBAlance.pageSize, this._itemBAlance.count);
  }

  calculatePageNumber(){
    this.responsePages= Math.ceil(this._itemBAlance.count / this._itemBAlance.pageSize);

    console.log("pgIndx="+this._itemBAlance.pageIndex + "pgcount="+this._itemBAlance.count)
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
    this._Icustomerfilter._pageIndex=pgIdx;
    this.curPdgIdx=this._Icustomerfilter._pageIndex
    console.log("currPage=" +this._Icustomerfilter._pageIndex );
  
    this.searchCustomersNofill();
  }
  
  
  
  searchCustomersNofill() {
    console.log(this._Icustomerfilter);
     
    this._ItemBalanceServiceService.GetAllBalancesFiltered(this._Icustomerfilter).subscribe({
      next: (res) => {
        this._itemBAlance = res;
        console.log( this._itemBAlance);
        this.calculatePageNumber();
        
      },
  
      error: (err) => {
        console.error('Error fetching customers:', err);
      }
  
    });
  }
  
  clearFilter(){
  
    this._Icustomerfilter = {
      _BCd:this.SelectedStore.store_id,
      _ItmCd: '' as string|undefined,
      _BBal: undefined as number | undefined,
      _IQty: undefined as number | undefined,
      _OQty: undefined as number | undefined,
      _ROrdr: undefined as number | undefined,
      _Cst: undefined as number | undefined,
      _sort: '' as string|undefined,
      _pageSize: 10,
      _pageIndex: 1
    };
    this.searchCustomers();
  }
  
  
  getCustomerById(id:number){
  
  /*  this._customerservice.getCustomerById(id).subscribe({
      next:(res)=>{
        console.log("edite Customer = res "+ res.data.id);
  
        this._customerservice.currentEditeCustomer=res.data
        console.log("edite Customer _customerservice.currentEditeCustomer = "+ this._customerservice.currentEditeCustomer.id);
        this._route.navigate(['/editeClient']);
      }
  
    
   
    })*/
    
  }
  
  
  getCustomerById_ShowDetails(id:number){
  
  /*  this._customerservice.getCustomerById(id).subscribe({
      next:(res)=>{
        console.log("edite Customer = res "+ res.data.id);
  
        this._customerservice.currentShowCustomer=res.data
      //  console.log(" this._customerservice.currentShowCustomer = "+  this._customerservice.currentShowCustomer.id);
        this._route.navigate(['/showClient']);
      }
  
    
   
    })
    */
  }
  
  
  
  gotoDeleteComponent(bCd:string ,itmCd:string ){//is called when click the trash button   <i class="fas fa-trash"></i>
  // set the customer id to be deleted  - 
  this.isDeleted=0 //this means there is a customer is set to be deleted when == 0
 this. deleted_bCd =bCd 
     this.deleted_itmCd=itmCd
  console.log("gotoDeleteComponentww"+" " +this.deleted_bCd ,"   ", this.deleted_itmCd )
  }
  
  
  softDelete(){
  
    console.log("this.isDeleted = " +this.isDeleted)
    console.log("deleted customers"+this.deleted_bCd , this.deleted_itmCd )

    this._ItemBalanceServiceService.DeleteBalance(this.deleted_bCd , this.deleted_itmCd).subscribe({
  
      next:(res)=>{
        console.log(res)
        this.isDeleted=-1
       this. deleted_bCd ='' 
     this.deleted_itmCd=''
        this._ToastrService.info("تم مسح الرصيد بنجاح" , "مسح رصيد")
      }
    })
  this.clearFilter()
  }

  SoftlyDelete(){

    this._Icustomerfilter = {
      _BCd: this.SelectedStore.store_id,
      _ItmCd: '' as string|undefined,
      _BBal: undefined as number | undefined,
      _IQty: undefined as number | undefined,
      _OQty: undefined as number | undefined,
      _ROrdr: undefined as number | undefined,
      _Cst: undefined as number | undefined,
      _sort: '' as string|undefined,
      _pageSize: 10,
      _pageIndex: 1
    };
    this._ItemBalanceServiceService.DeleteBalance(this.deleted_bCd , this.deleted_itmCd) // User ID
    .pipe(
    
      switchMap(user => {
      
        return this._ItemBalanceServiceService.GetAllBalancesFiltered(this._Icustomerfilter);
        
      }),
      tap(filteredBalances => {
        console.log('Both services completed successfully!');
        console.log('Filtered balances:', filteredBalances);
        // YOUR ACTIONS HERE
       this.dontDelete()
       this._itemBAlance=filteredBalances
      }),
      catchError(error => {
       console.log(error)
         
        return of(null);
      })
    ) .subscribe(preferences => {
      
      if (preferences) {
        console.log('User preferences:', preferences);
      }
    });
  }
  
  
  dontDelete(){
  
    console.log("this.isDeleted = " +this.isDeleted)
    console.log("this.deletedCustomer = " +this.deleted_bCd)
    this.isDeleted=-1
    this. deleted_bCd ='' 
     this.deleted_itmCd=''
    console.log("this.isDeleted = " +this.isDeleted)
    console.log("this.deletedCustomer = " +this.deleted_bCd)
  
  
  }
  
  gotoAddClient(){
    const data= {store_id:this.SelectedStore.store_id}
    this._route.navigate(['/AddITemBalance'] , {state:{data:data}});
  }
  
  incrementPDg(){
  
    if(this._Icustomerfilter._pageIndex <this.responsePages){ 
      this._Icustomerfilter._pageIndex=this._Icustomerfilter._pageIndex+1;
      this.navigatePaging(this._Icustomerfilter._pageIndex);}
   
  }
  decrementPDg(){
    if(this._Icustomerfilter._pageIndex >1){
      this._Icustomerfilter._pageIndex=this._Icustomerfilter._pageIndex-1;
      this.navigatePaging(this._Icustomerfilter._pageIndex);
    }
   
  }

  EditeItemBal(){
    this._route.navigate(['/editeITemBalance'])
  }
  
  }
  