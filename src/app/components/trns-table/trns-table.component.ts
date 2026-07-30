import { Component, effect, inject, Input, input, OnDestroy, OnInit, untracked } from '@angular/core';
import { CustomerServiceService } from '../../core/services/customer-service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Icustomer,Icustomerfilter } from '../../core/interfaces/icustomer';
import { FormBuilder, FormGroup, FormsModule, Validators,ReactiveFormsModule } from '@angular/forms'; // Import FormsModule
import { NavbarHoverDirective } from '../../core/directives/navbar-hover.directive';
import { ToastrService } from 'ngx-toastr';
import { FixedButtonComponent } from "../fixed-button/fixed-button.component";
import { TranslateModule } from '@ngx-translate/core';
import { FixedClickComponent } from "../fixed-click/fixed-click.component";
import { TruncatePipe } from '../../core/pipes/truncate.pipe';
import { HeaderServiceService } from '../../core/header-service.service';
import { Details, Dtls, KeyHdrs } from '../../core/interfaces/ivDtls';


import { ChangeDetectionStrategy, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ItemDialogueComponent } from '../Dialouge/item-dialogue/item-dialogue.component';
import { item } from '../../core/interfaces/iitem';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../core/services/token.service';
import { ItemsServiceService } from '../../core/services/items-service.service';
import { ServiceResponse } from '../../core/interfaces/ServiceResponse';
import { DetailsHdrsSharedSignalsService } from '../../core/services/SignalsServices/details-hdrs-shared-signals.service';
import { EMPTY, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';
//import { ItemDialogueComponent } from '../../components/Dialouge/item-dialogue';

@Component({
  selector: 'app-trns-table',
  standalone: true,
  imports: [FormsModule, RouterModule,
    NavbarHoverDirective, FixedButtonComponent,ReactiveFormsModule,
     TranslateModule, FixedClickComponent,
   TruncatePipe,
   MatFormFieldModule, MatInputModule, MatButtonModule,CommonModule],
  templateUrl: './trns-table.component.html',
  styleUrl: './trns-table.component.css',
  //changeDetection: ChangeDetectionStrategy.OnPush,

})
export class TrnsTableComponent  implements OnInit, OnDestroy {
  @Input() curr_TrsTy!:number
  @Input() curr_Store_id:any
  @Input() curr_Store_Name:any
  @Input() curr_TrsDt:any
  @Input() curr_dty:any
 // @Input({ required: true })  isActiveCurr_TrstNo !:Signal<string>

 isActiveCurr_TrstNo = input.required<number>();
 isActiveCurr_CstID = input.required<number>();
  trsNo: any;
  lnNo: any;
  isDetailsDeleted:number=-1
  isDeletedSuccess:number=-1
  
  onEditButtonClicked() {
    this.gotoAddClient();
  }
    _customers: Details= { data: [] } as any;
    responsePages!:number
    pagesList: number[] = []
    isDeleted!:number
    deletedCustomer!:number
    curPdgIdx!:number
    private _ToastrService=inject(ToastrService)
      hdr:KeyHdrs={
        strCd: '',
        trsTy: 0,
        trsNo: 0
      }
     
   // _Icustomerfilter!:Icustomerfilter 
  
    _Icustomerfilter = {
      _StrCd: '' as string | undefined,
      _TrsTy:undefined as number | undefined,
      _TrsNo:undefined as number | undefined,
      _LnNo: undefined as number | undefined,
      _TrsDt: undefined as Date | undefined,

      _CstId:  undefined as number | undefined|null,
      _ItmCd: '' as string | undefined,
      _Qty: undefined as number | undefined,
      _Pric: undefined as number | undefined,
      _BCd:  undefined as number | undefined,
      _Bck:  undefined as number | undefined,
      _ONo: undefined as number | undefined,
      _GQty: undefined as number | undefined,
      _Own: '' as string | undefined,
      _LUsr: '' as string | undefined,
      _CTm: undefined as Date | undefined,
      _LTm: undefined as Date | undefined,
      _Cst:  undefined as number | undefined,
      _Sort: '' as string | undefined,
      _pageIndex: 1 as number,
      _pageSize: 10
    
    };
  
 
  
    private readonly destroy$ = new Subject<void>();
    /** Reload details + max line; cancels in-flight requests when inputs change quickly */
    private readonly detailsLoad$ = new Subject<{
      resetPaging?: boolean;
      skipFillPages?: boolean;
      /** Runs after details list is applied (before max line fetch) */
      onAfterDetails?: () => void;
    }>();

    constructor(private _HeaderServiceService:HeaderServiceService,
      private Actroute:ActivatedRoute,
      private _route:Router,private _tokenService:TokenService,
      private _ItemsServiceService:ItemsServiceService,
      private _DetailsHdrsSharedSignalsService:DetailsHdrsSharedSignalsService
    ){
      this.isDeleted=-1
      this.deletedCustomer=-1
      this.curPdgIdx=1
      this.var_ItemInputSwitch=1

      // Reload table only when document / customer context changes — not when `animal` changes
      effect(() => {
        this.isActiveCurr_TrstNo();
        this.isActiveCurr_CstID();
        this.detailsLoad$.next({ resetPaging: true });
      });

      // Keep form in sync with selected item without triggering a full details refetch
      effect(() => {
        const item = this.animal();
        untracked(() => {
          this.AddNewDetails.patchValue({
            pric: item?.pric,
            var_searchItemCode: item?.id
          });
        });
      });
    }

    private syncFilterFromInputs(): void {
      this._Icustomerfilter._StrCd = this.curr_Store_id;
      this._Icustomerfilter._TrsTy = this.curr_TrsTy;
      this._Icustomerfilter._TrsNo = Number(this.isActiveCurr_TrstNo());
      this._Icustomerfilter._CstId = Number(this.isActiveCurr_CstID());
      this.hdr = {
        strCd: this._Icustomerfilter._StrCd,
        trsTy: this._Icustomerfilter._TrsTy,
        trsNo: this._Icustomerfilter._TrsNo,
      };
    }

    private setupDetailsLoadPipeline(): void {
      this.detailsLoad$
        .pipe(
          debounceTime(15),
          map((opts) => {
            if (opts.resetPaging) {
              this._Icustomerfilter._pageIndex = 1;
              this.curPdgIdx = 1;
            }
            this.syncFilterFromInputs();
            const trsNo = Number(this._Icustomerfilter._TrsNo);
            const cstId = Number(this._Icustomerfilter._CstId);
            const dedupeKey = `${String(this._Icustomerfilter._StrCd)}|${String(this._Icustomerfilter._TrsTy)}|${trsNo}|${cstId}|${this._Icustomerfilter._pageIndex}|${opts.skipFillPages ? '1' : '0'}`;
            return { opts, dedupeKey, trsNo };
          }),
          distinctUntilChanged(
            (a, b) =>
              a.dedupeKey === b.dedupeKey && !a.opts.onAfterDetails && !b.opts.onAfterDetails
          ),
          switchMap(({ opts, trsNo }) => {
            if (
              !this._Icustomerfilter._StrCd ||
              this._Icustomerfilter._TrsTy === undefined ||
              Number.isNaN(trsNo) ||
              trsNo <= 0
            ) {
              return EMPTY;
            }
            return this._HeaderServiceService
              .getAllDetailsFiltered(this._Icustomerfilter)
              .pipe(
                switchMap((res) => {
                  this._customers = res;
                  this.calculatePageNumber();
                  if (!opts.skipFillPages) {
                    this.fillPagesList();
                  }
                  opts.onAfterDetails?.();
                  if (
                    Number.isNaN(Number(this.hdr.trsNo)) ||
                    this.hdr.trsNo === null ||
                    this.hdr.trsNo === undefined
                  ) {
                    return EMPTY;
                  }
                  return this._HeaderServiceService.getMaxDtlsLno(this.hdr);
                }),
                tap((maxLnNo) => {
                  if (maxLnNo?.myProperty != null) {
                    this.AddNewDetails.patchValue({
                      lnNo: maxLnNo.myProperty,
                    });
                  }
                })
              );
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
    sysInfodto:any
  
  
    _totalCustomerCount:number=0
    _totalBidderCount:number =0
    _totalBuyerCount:number=0
    _totalBothCount:number=0
    ngOnInit(): void {

      console.log(" [curr_TrsTy]=========>>>" ,this.curr_TrsTy )
      console.log(" [curr_TrsTy]========>>>>>>" ,this.curr_Store_id )
      this.isDeleted=-1 // no element is set to be deleted
      this.deletedCustomer=-1 // the id of customer is to be deleted is null
      this._Icustomerfilter._pageIndex=1;
      this.curPdgIdx=1
      this.var_ItemInputSwitch=1

      
      this._Icustomerfilter._StrCd=this.curr_Store_id
      this._Icustomerfilter._TrsTy=this.curr_TrsTy
      this._Icustomerfilter._TrsNo=Number(this.isActiveCurr_TrstNo())
      console.log("انا هناااااااااااااا" + this._Icustomerfilter._TrsNo)
      this._Icustomerfilter._CstId=Number(this.isActiveCurr_CstID())

      this.setupDetailsLoadPipeline();

      this. isDetailsDeleted=-1
      this.sysInfodto={
        accptMinus:this._tokenService.GetUserStoreSettings()?.AcceptMinus
      }
   }

   ngOnDestroy(): void {
     this.destroy$.next();
     this.destroy$.complete();
   }
  
   
  
   searchCustomers() {
    console.log(this._Icustomerfilter);
    this.detailsLoad$.next({ resetPaging: true });
  }
  
  
  calculatePageNumber(){
    this.responsePages= Math.ceil(this._customers.count / this._customers.pageSize);
    
    console.log("pgIndx="+this._customers.pageIndex + "pgcount="+this._customers.count)
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
    this.detailsLoad$.next({ skipFillPages: true });
  }
  
  clearFilter(){
  
    this._Icustomerfilter = {
      _StrCd: this.curr_Store_id,
      _TrsTy: this.curr_TrsTy,
      _TrsNo:Number(this.isActiveCurr_TrstNo()),
      _LnNo: undefined as number | undefined,
      _TrsDt: undefined as Date | undefined,
      _CstId:  Number(this.isActiveCurr_TrstNo()),
      _ItmCd: '' as string | undefined,
      _Qty: undefined as number | undefined,
      _Pric: undefined as number | undefined,
      _BCd:  undefined as number | undefined,
      _Bck:  undefined as number | undefined,
      _ONo: undefined as number | undefined,
      _GQty: undefined as number | undefined,
      _Own: '' as string | undefined,
      _LUsr: '' as string | undefined,
      _CTm: undefined as Date | undefined,
      _LTm: undefined as Date | undefined,
      _Cst:  undefined as number | undefined,
      _Sort: '' as string | undefined,
      _pageIndex: 1 as number,
      _pageSize: 10
    
    };

    this._Icustomerfilter._StrCd=this.curr_Store_id
    this._Icustomerfilter._TrsTy=this.curr_TrsTy
    this._Icustomerfilter._TrsNo=Number(this.isActiveCurr_TrstNo())
    this.searchCustomers();
  }
  
  
  editeDetailsData(item:Dtls){
 
    let metadata={
      curr_Store_Name:this.curr_Store_Name,
      curr_Store_id:this.curr_Store_id,
      curr_TrsTy:this.curr_TrsTy,
      trsNo:this.trsNo,
      lnNo:this.lnNo,
      dTy:this.curr_dty,
      Item:item,
      
    }


    console.log(metadata)
    
    this._route.navigate(['/addNewDetail'] , {state:{data:metadata}})
    
  }
  
  
  getCustomerById_ShowDetails(id:number){
  
  
  
    
   
    
    
  }
  
  
  
  gotoDeleteComponent(id:number){//is called when click the trash button   <i class="fas fa-trash"></i>
  // set the customer id to be deleted  - 
  this.isDeleted=0 //this means there is a customer is set to be deleted when == 0
  this.deletedCustomer = id
  console.log("deleted customers"+this.deletedCustomer)
  }
  
  
  softDelete(){
  
    console.log("this.isDeleted = " +this.isDeleted)
    console.log("this.deletedCustomer = " +this.deletedCustomer)
   /* this._customerservice.deleteCustomer(this.deletedCustomer).subscribe({
  
      next:(res)=>{
        console.log(res)
        this.isDeleted=-1
        this.deletedCustomer=-1
        this._ToastrService.info("تم مسح المشترك بنجاح" , "مسح مشترك")
      }
    })*/
  this.clearFilter()
  }
  
  
  dontDelete(){
  
    console.log("this.isDeleted = " +this.isDeleted)
    console.log("this.deletedCustomer = " +this.deletedCustomer)
    this.isDeleted=-1
    this.deletedCustomer=-1
    console.log("this.isDeleted = " +this.isDeleted)
    console.log("this.deletedCustomer = " +this.deletedCustomer)
  
  
  }
  
  gotoAddClient(){
    this._route.navigate(['/addClient']);
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



  readonly animal = signal<item|null>(null);
  readonly ItemName = model('');
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.var_ItemInputSwitch=1
     
     
    const dialogRef = this.dialog.open(ItemDialogueComponent, {
      data: { name: this.ItemName(), animal: this.animal() },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.animal.set(result);
      }
    });
  }



  private fb = inject(FormBuilder);

  AddNewDetails: FormGroup = this.fb.group({
    strCd: ['', Validators.required],
    trsTy: [0, Validators.required],
    trsNo: [null, Validators.required],
    lnNo: [0],
    trsDt: [''],
    cstId: [0],
    itmCd: [''],
    qty: [0],
    pric: [0],                  
    own: [''],    
    ctm:[this.getCurrentDateTime()],
    ltm:[this.getCurrentDateTime()],
    var_searchItemCode:['']
     
  });

  private getCurrentDateTime(): string {
    return new Date().toISOString().slice(0, 16); // Format for datetime-local input
  }

addNewDetailsSysinfo:any

  
  AddnewGetails(){

    const trsNoValue = this.isActiveCurr_TrstNo();
    this.AddNewDetails.patchValue({
      strCd: this.curr_Store_id,
      trsTy: this.curr_TrsTy,
      trsNo: trsNoValue ,
      trsDt:this.curr_TrsDt,
      cstId: this.isActiveCurr_CstID(),
      itmCd: this.animal()?.id,  // ✅ Fixed typo: 'itmcd' → 'itmCd'
      own:  this._tokenService.getGivenName()
    });
    
    this.addNewDetailsSysinfo={
      addNewDtlsDtoprop: this.AddNewDetails.value,
      sysInfo:this.sysInfodto
    }


    this._HeaderServiceService.AddNewDetails(this.addNewDetailsSysinfo).subscribe({//this.AddNewDetails.value
      next:(res)=>{
        this._customers.data.push(res.data)
        if(res.obj != null){
          this._ToastrService.warning(res.message , "اضافة سطر" ,{
             positionClass:'toast-bottom-center'
          })
          if(res.totalVal != null){
            this.SetHeaderVal(res.totalVal)
          }
          
        }else{
          this._ToastrService.success("تم الاضافة بنجاح" , "اضافة سطر" , {
             positionClass: 'toast-center-center',
             toastClass: 'ngx-toastr custom-large-toast',
             tapToDismiss:true,
             disableTimeOut:true,
             closeButton:true
              
          })
          if(res.totalVal != null){
            this.SetHeaderVal(res.totalVal)
          }
        }

        this.AddNewDetails.patchValue({
          lnNo:this.AddNewDetails.get('lnNo')?.value+1 ,
         }) 
      }
    })
    console.log(this.AddNewDetails.value)
  }

  calculateValue(){
    this.AddNewDetails.get("qty")?.value *  this.AddNewDetails.get("pric")?.value
  }


  var_ItemInputSwitch:number=1
  //var_searchItemCode:string=''
  dynamicItemSearch:item={
    id: '',
    itmNm: '',
    bCst: 0,
    lPrc: 0,
    pric: 0,
    mUnt: '',
    back: 0,
    tax: 0,
    barCod: '',
    gPrc: 0,
    ctgName: ''
  }
  

  deletedDetail:Dtls={
    storeName: '',
    strCd: '',
    trsTy: 0,
    trsNo: 0,
    lnNo: 0,
    trsDt: '',
    customerName: '',
    cstId: 0,
    itemName: '',
    itmCd: '',
    qty: 0,
    pric: 0,
    bCd: 0,
    bck: 0,
    oNo: 0,
    gQty: 0,
    own: '',
    lUsr: '',
    cTm: '',
    lTm: '',
    cst: 0,
    id: undefined
  }
  FindItemName(itncd:string){
    this.var_ItemInputSwitch=2
    if(itncd==''){
      this._ToastrService.error("لا يوجد بيانات" , "لا يمكن ان يكون اسم المنتج فارغا ",{
        positionClass:'toast-bottom-center'
      })
      this.dynamicItemSearch={
        id: '',
        itmNm: '',
        bCst: 0,
        lPrc: 0,
        pric: 0,
        mUnt: '',
        back: 0,
        tax: 0,
        barCod: '',
        gPrc: 0,
        ctgName: ''
      
      
      }
    }
    
    if(itncd!=''){
      this._ItemsServiceService.getFilteredItems(
        {
          _IdName: itncd,
          pageSize: 1,
          pageIndex: 1
        }
      ).subscribe({
        next:(res)=>{
          if(res.data.length >0){
            this.dynamicItemSearch=res.data[0]
            console.log(this.dynamicItemSearch)
          }
          else{
            this.dynamicItemSearch={
              id: '',
              itmNm: '',
              bCst: 0,
              lPrc: 0,
              pric: 0,
              mUnt: '',
              back: 0,
              tax: 0,
              barCod: '',
              gPrc: 0,
              ctgName: ''
            
            
            }

            this._ToastrService.error("لا يوجد بيانات" , "لا يوجد منتج بهذا الاسم" , {
              positionClass:'toast-bottom-center'
            })
          }
         
          
        },
        error:()=>{
  
        }
      })
    }
   

  }

  FindItemNameExactMAtch(itncd:string){
    this.var_ItemInputSwitch=2
    if(itncd==''){
      this .AddNewDetails.get('pric')?.setValue(null)
      this._ToastrService.error("لا يوجد بيانات" , "لا يمكن ان يكون اسم المنتج فارغا ",{
        positionClass:'toast-bottom-center'
      })
      this.dynamicItemSearch={
        id: '',
        itmNm: '',
        bCst: 0,
        lPrc: 0,
        pric: 0,
        mUnt: '',
        back: 0,
        tax: 0,
        barCod: '',
        gPrc: 0,
        ctgName: ''
      
      
      }
    }
    
    if(itncd!=''){
      this._ItemsServiceService.getFilteredItemsExactMatch(
        itncd
      ).subscribe({
        next:(res)=>{
          if(res.data.length >0){
            this.dynamicItemSearch=res.data[0]
          
            this.animal.set(this.dynamicItemSearch);
            console.log(this.dynamicItemSearch)
          }
          else{
            this.dynamicItemSearch={
              id: '',
              itmNm: '',
              bCst: 0,
              lPrc: 0,
              pric: 0,
              mUnt: '',
              back: 0,
              tax: 0,
              barCod: '',
              gPrc: 0,
              ctgName: ''                        
            }
           this .AddNewDetails.get('pric')?.setValue(null)
            this._ToastrService.error("لا يوجد بيانات" , "لا يوجد منتج بهذا الاسم" , {
              positionClass:'toast-bottom-center'
            })
          }
         
          
        },
        error:()=>{
  
        }
      })
    }
   

  }
  clickDelete(item:any){
    this.deletedDetail=item
    this.isDetailsDeleted=1
  }
  cancelDelete(){
    this.isDetailsDeleted=-1
  }

  VARXXX:boolean=true
 /* deleteDetail(){
    console.log("==========>> deletedDetail" ,this.deletedDetail )
    this.isDeletedSuccess=-1
    this._HeaderServiceService.DeleteDetailsdata(this.deletedDetail?.strCd , this.deletedDetail?.trsTy,this.deletedDetail?.trsNo,this.deletedDetail?.lnNo).subscribe({
      next:(res)=>{
        this.VARXXX=res.isSuccess
        console.log("Ressssssssssssssssssssssssssssssssssssss",res)
        if(this.VARXXX== true){
          this.isDeletedSuccess=1
        }
      }
    })
    this.dynamicItemSearch={
      id: '',
      itmNm: '',
      bCst: 0,
      lPrc: 0,
      pric: 0,
      mUnt: '',
      back: 0,
      tax: 0,
      barCod: '',
      gPrc: 0,
      ctgName: ''
    }    
    this.isDetailsDeleted=-1
    console.log("fuckkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk!!!!!!!")  
    this._Icustomerfilter._StrCd=this.curr_Store_id
      this._Icustomerfilter._TrsTy=this.curr_TrsTy
      this._Icustomerfilter._TrsNo=Number(this.isActiveCurr_TrstNo())
      this._Icustomerfilter._CstId=Number(this.isActiveCurr_CstID())
      if(this.isDeletedSuccess==1 ){
        setTimeout(() => {
          this._HeaderServiceService.getAllDetailsFiltered(this._Icustomerfilter).subscribe({
              next: (res) => {
                  this._customers = res;
                  console.log("Updated data after delete:", res);
                  this.calculatePageNumber();
                  this.pagesList.length = 0;
                  this.fillPagesList();
                  if(res.obj != null){
                    this._ToastrService.warning("تم الحذف بنجاح" , "حذف سطر" ,{
                      positionClass: 'toast-center-center',
                      toastClass: 'ngx-toastr custom-large-toast',
                      tapToDismiss:true,
                      disableTimeOut:true,
                      closeButton:true
                    })
                  }
                  else{
                    this._ToastrService.success("تم الحذف بنجاح" , "حذف سطر" ,{
                      positionClass: 'toast-center-center',
                      toastClass: 'ngx-toastr custom-large-toast',
                      tapToDismiss:true,
                      disableTimeOut:true,
                      closeButton:true
                    })
                  }
                
              }
          });
      }, 300);
      }    
  }*/

      DeletedResponse:ServiceResponse={
        isSuccess: false,
        errors: undefined,
        message: '',
        myProperty: undefined,
        obj: undefined
      }
      deleteDetail() {

        console.log("==========>> deletedDetail", this.deletedDetail);
        this.isDeletedSuccess = -1;
      
        if (!this.deletedDetail) return;
      
        const { strCd, trsTy, trsNo, lnNo } = this.deletedDetail;
      
        this._HeaderServiceService
          .DeleteDetailsdata(strCd, trsTy, trsNo, lnNo)
          .subscribe({
            next: (res) => {
              console.log("Delete response:", res);
              this.DeletedResponse = res
              if (res?.isSuccess === true) {      
                this.isDeletedSuccess = 1;    
                this.SetHeaderVal(res.totalVal)
        
                // reset UI data
                this.dynamicItemSearch = {
                  id: '',
                  itmNm: '',
                  bCst: 0,
                  lPrc: 0,
                  pric: 0,
                  mUnt: '',
                  back: 0,
                  tax: 0,
                  barCod: '',
                  gPrc: 0,
                  ctgName: ''
                };
      
                this.isDetailsDeleted = -1;
      
                // build filter
                this._Icustomerfilter._StrCd = this.curr_Store_id;
                this._Icustomerfilter._TrsTy  = this.curr_TrsTy;
                this._Icustomerfilter._TrsNo  = Number(this.isActiveCurr_TrstNo());
                this._Icustomerfilter._CstId  = Number(this.isActiveCurr_CstID());
      
                // refresh data AFTER delete success (same pipeline; cancels races with other loads)
                this.detailsLoad$.next({
                  skipFillPages: false,
                  onAfterDetails: () => {
                    if (this.DeletedResponse.isSuccess === true && this.DeletedResponse.obj != null) {
                      this._ToastrService.warning("تم الحذف بنجاح", this.DeletedResponse.message, {
                        positionClass: 'toast-center-center',
                        toastClass: 'ngx-toastr custom-large-toast',
                        tapToDismiss: true,
                        disableTimeOut: true,
                        closeButton: true,
                      });
                    } else {
                      this._ToastrService.success("تم الحذف بنجاح", "حذف سطر", {
                        positionClass: 'toast-center-center',
                        toastClass: 'ngx-toastr custom-large-toast',
                        tapToDismiss: true,
                        disableTimeOut: true,
                        closeButton: true,
                      });
                    }
                  },
                });
              }
            },
            error: (err) => {
              console.error("Delete failed:", err);
            }
          });
      }
      



      SetHeaderVal(headerVal:number) {
        this._DetailsHdrsSharedSignalsService.setHeaderValue(
          {
            totalVal:headerVal
        }
      );
      }

   

  }