import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IItems } from '../../core/interfaces/iitem';
import { FormsModule } from '@angular/forms';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { TokenService } from '../../core/services/token.service';
import { Users } from '../../core/interfaces/iaccount';
import { AccountService } from '../../core/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FixedButtonComponent } from "../fixed-button/fixed-button.component";
import { TranslateModule } from '@ngx-translate/core';
import { TruncatePipe } from '../../core/pipes/truncate.pipe';


@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [FormsModule, FixedButtonComponent,TranslateModule,TruncatePipe],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit{
onEditButtonClicked() {
  this.gotoAddClient();
}


  private readonly _NgxSpinnerService= inject(NgxSpinnerService)

  __iItems: IItems= { data: [] } as any;

  _users:Users={
    status: false,
    message: '',
    data: []
  }
  responsePages!:number
  pagesList: number[] = []
  isDeleted!:number
  deletedCustomer!:string
   
  _totalUSersCount:number=0
  _totalActiveUsersCount:number=0
  _totalInactiveUsersCount:number=0


  _Icustomfilter = {
   
   
    _IdName: '' as string | undefined,
    _itmName: '' as string | undefined,
    _BarCode: '' as string | undefined,
  

    _CtgID: undefined as number | undefined,
    Sort: '' as string | undefined,
    pageIndex: undefined as number | undefined,
    pageSize: undefined as number | undefined
  };

 

  constructor(
    private Actroute:ActivatedRoute,
    private _route:Router,
    private _token:TokenService,
    private _AccountService:AccountService
  ){
    this.isDeleted=-1
    this.deletedCustomer=""
    this._AccountService.getAllUsers().subscribe({
      next:(res)=>{
        this._users = res
      }
    }
    
    )
    
  }
  ngOnInit(): void {
    this._NgxSpinnerService.show()
    this._AccountService.getAllUsersCounts().subscribe({
      next:(res)=>{
        this._totalUSersCount=res.myProperty.totalUSersCount
        this._totalActiveUsersCount=res.myProperty.totalActiveUsersCount
        this._totalInactiveUsersCount=res.myProperty.totalInactiveUsersCount
      }
      
    })
    this._NgxSpinnerService.hide()

  }



  searchCustomers() {
    /*console.log("hereeeeeeeeeeeeeeeeee>>>>>>>>"+this._Icustomfilter._CtgID);
    this._Icustomfilter.pageIndex=1;
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
  
    });*/
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
    //this._Icustomfilter.pageIndex=pgIdx;
  //  console.log("currPage=" +this._Icustomfilter.pageIndex );
  
    this.searchCustomersNofill();
  }
  
  /*********************************** **********************/
  
  searchCustomersNofill() {
   // console.log(this._Icustomfilter);
     
    /*this._itemsService.getFilteredItems(this._Icustomfilter).subscribe({
      next: (res) => {
        this.__iItems = res;
        console.log( this.__iItems);
        this.calculatePageNumber();
        
      },
  
      error: (err) => {
        console.error('Error fetching customers:', err);
      }
  
    });*/
  }
  
  clearFilter(){
  
   /* this._Icustomfilter = {
      _IdName: '' as string | undefined,
      _itmName: '' as string | undefined,
      _BarCode: '' as string | undefined,
    
  
      _CtgID: undefined as number | undefined,
      Sort: '' as string | undefined,
      pageIndex: undefined as number | undefined,
      pageSize: undefined as number | undefined
    };*/
    this.searchCustomers();
  }
  
  
  getCustomerById(id:string){
  
   /* this._itemsService.getItemById(id).subscribe({
      next:(res)=>{
        console.log("edite Customer = res "+ res.data.id);
  
        this._itemsService.currentEditeItem=res.data
        console.log("edite Customer _customerservice.currentEditeCustomer = "+ this._itemsService.currentEditeItem.id);
        this._route.navigate(['/itemdedite']);
      }
  
    
   
    })*/
    
  }
  
  
  getCustomerById_ShowDetails(id:string){
  
 /*   this._itemsService.getItemById(id).subscribe({
      next:(res)=>{
        console.log("edite Customer = res "+ res.data.id);
  
        this._itemsService.currentShowItem=res.data
      //  console.log(" this._customerservice.currentShowCustomer = "+  this._customerservice.currentShowCustomer.id);
        this._route.navigate(['/itemdetails']);
      }
  
    
   
    })*/
    
  }
  
  
  
  gotoDeleteComponent(id:string){//is called when click the trash button   <i class="fas fa-trash"></i>
  // set the customer id to be deleted  - 
  this.isDeleted=0 //this means there is a customer is set to be deleted when == 0
  this.deletedCustomer = id
  console.log("deleted customers"+this.deletedCustomer)
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
   
    
    this._route.navigate(['/UserDataRegister']);
  }
  

  goToRolesPage(userName:string){
    this._route.navigate(['/UserRoles'], {
      state: { userName:userName }
    });
  }


  gotoUserData(_username:string){
    this._route.navigate(['/UserDataUpdate'] , {queryParams:{_username}})

  }

  disableUser(){
    console.log("this.isDeleted = " +this.isDeleted)
    console.log("this.deletedCustomer = " +this.deletedCustomer)
  this._AccountService.toggleUserStatus(this.deletedCustomer).subscribe({
    next:(resss)=>{
      console.log(resss)
       this.isDeleted=-1
        this.deletedCustomer=""
      
    }
  })
this._route.navigate(['/UserDetails'])
  this.clearFilter()

  }


  softDelete(){
  
    console.log("this.isDeleted = " +this.isDeleted)
    console.log("this.deletedCustomer = " +this.deletedCustomer)
   /* this._itemsService.deleteItem(this.deletedCustomer).subscribe({
  
      next:(res)=>{
        console.log(res)
        this.isDeleted=-1
        this.deletedCustomer=""
      }
    })*/
  this.clearFilter()
  }
}
