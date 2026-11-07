import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IItems } from '../../core/interfaces/iitem';
import { FormsModule } from '@angular/forms';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { TokenService } from '../../core/services/token.service';
import { Users } from '../../core/interfaces/iaccount';
import { ToastrService } from 'ngx-toastr';
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
  /** true = the pending confirmation will activate the user, false = deactivate */
  pendingActivate = false

  // client-side pagination, since /api/Accounts/GetAllUsers returns every user in one shot
  pageSize:number = 5
  currentPage:number = 1
   
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
    private _AccountService:AccountService,
    private _toastr:ToastrService
  ){
    this.isDeleted=-1
    this.deletedCustomer=""
    this.loadUsers()

  }

  /** (re)loads every user; keeps the current page when it still exists */
  private loadUsers(): void {
    this._AccountService.getAllUsers().subscribe({
      next:(res)=>{
        this._users = res
        this.calculatePageNumber()
        this.fillPagesList()
        this.currentPage = Math.min(this.currentPage, Math.max(1, Math.ceil((res.data?.length ?? 0) / this.pageSize)))
      }
    })
  }

  private loadCounts(): void {
    this._AccountService.getAllUsersCounts().subscribe({
      next:(res)=>{
        this._totalUSersCount=res.myProperty.totalUSersCount
        this._totalActiveUsersCount=res.myProperty.totalActiveUsersCount
        this._totalInactiveUsersCount=res.myProperty.totalInactiveUsersCount
      }
    })
  }

  ngOnInit(): void {
    this._NgxSpinnerService.show()
    this.loadCounts()
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

  get pagedUsers(){
    const start = (this.currentPage - 1) * this.pageSize;
    return (this._users.data ?? []).slice(start, start + this.pageSize);
  }

  get showingFrom(): number {
    if(!this._users.data?.length) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    if(!this._users.data?.length) return 0;
    return Math.min(this.currentPage * this.pageSize, this._users.data.length);
  }

  calculatePageNumber(){
    this.responsePages= Math.ceil((this._users.data?.length ?? 0) / this.pageSize);

  }


  fillPagesList(){
    this.pagesList=[]
    for (let index = 0; index < this.responsePages; index++) {
       this.pagesList.push(index+1);
        console.log(this.pagesList)
    }

  }
  navigatePaging(pgIdx:number){
    this.currentPage = pgIdx;
  }

  incrementPDg(){
    if(this.currentPage < this.responsePages){
      this.currentPage++;
    }
  }

  decrementPDg(){
    if(this.currentPage > 1){
      this.currentPage--;
    }
  }
  
  /*********************************** **********************/

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
  
  
  
  /** opens the confirmation box to activate (inactive user) or deactivate (active user) */
  askToggleStatus(user: { userName: string, isActive: boolean }){
    this.isDeleted = 0 // a user is waiting for confirmation when != -1
    this.deletedCustomer = user.userName
    this.pendingActivate = !user.isActive
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


  goToStoreAccess(userName:string){
    this._route.navigate(['/UserStoreAccess'], {
      state: { userName:userName }
    });
  }


  gotoUserData(_username:string){
    this._route.navigate(['/UserDataUpdate'] , {queryParams:{_username}})

  }

  confirmToggleStatus(){
    const userName = this.deletedCustomer
    const activating = this.pendingActivate

    this._AccountService.toggleUserStatus(userName).subscribe({
      next:()=>{
        this._toastr.success(activating ? `تم تفعيل المستخدم ${userName}` : `تم ايقاف المستخدم ${userName}`)
        this.loadUsers()
        this.loadCounts()
      },
      error:(err)=> this._toastr.error(err.error?.message ?? 'تعذر تغيير حالة المستخدم')
    })

    this.isDeleted=-1
    this.deletedCustomer=""
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
