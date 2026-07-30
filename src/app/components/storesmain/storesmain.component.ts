import { Component , inject, OnInit } from '@angular/core';
import { CustomerServiceService } from '../../core/services/customer-service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Icustomer,Icustomerfilter } from '../../core/interfaces/icustomer';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ItemsServiceService } from '../../core/services/items-service.service';
import { IItems } from '../../core/interfaces/iitem';
import { NavbarHoverDirective } from '../../core/directives/navbar-hover.directive';
import { ToastrService } from 'ngx-toastr';
import { CategoriesService } from '../../core/services/categories.service';
import { Categories } from '../../core/interfaces/categories';
import { stores } from '../../core/interfaces/Stores';
import { StoresService } from '../../core/services/stores.service';

@Component({
  selector: 'app-storesmain',
  standalone: true,
  imports: [FormsModule , RouterModule,NavbarHoverDirective],

  templateUrl: './storesmain.component.html',
  styleUrl: './storesmain.component.css'
})
export class StoresmainComponent implements OnInit{

  isEdited!:number
  curr_EditedCtg_name:string=""
  curr_EditedCtrg_Id:any=-1
  editedData:object={}

  isShowed:number = -1

  isAdded!:number
  curr_AddededCtg_name:string=""
  curr_AddedCtrg_Id:number|undefined
  AddedData:object={}

 
  
  __iItems: IItems= { data: [] } as any;
  _stores: stores = {
    pageSize: 0,
    pageIndex: 0, // or undefined
    count: 0,
    totalCount: 0,
    data:[]
  };

  responsePages!:number
  pagesList: number[] = []
  isDeleted!:number
  deletedCustomer!:any
  private _ToastrService=inject(ToastrService)
   
 // _Icustomerfilter!:Icustomerfilter 

  _Icustomfilter = {
    _strCd:'' as string | undefined,
    _StrNm:'' as string |undefined,
    _PNam:'' as string | undefined,
    _Sort:'' as string | undefined,
    _pageIndex:undefined as number | undefined,
    _pageSize:undefined as number | undefined 
  };

  


  constructor(private _StoresService:StoresService,
    private Actroute:ActivatedRoute,
    private _route:Router
  ){
    this.isDeleted=-1
    this.deletedCustomer=-1


    this.isEdited=-1
    this.curr_EditedCtg_name=""
    this.curr_EditedCtrg_Id=-1
    this.editedData={}



    this.isAdded=-1
  this.curr_AddededCtg_name=""
  this.curr_AddedCtrg_Id=undefined
  this.AddedData={}
  }


  ngOnInit(): void {
    
    this.isDeleted=-1 // no element is set to be deleted
    this.deletedCustomer=-1 // the id of customer is to be deleted is null
    this._Icustomfilter._pageIndex=1;
    this._Icustomfilter._pageSize=5;
    this.isEdited=-1



    this.curr_EditedCtg_name=""
    this.curr_EditedCtrg_Id=-1
    
    this._StoresService.GetAllStoresFiltered(this._Icustomfilter).subscribe({

     next:(res)=>{
      
      this._stores=res
      
       console.log("Welcome!!!!!",res)
       this.calculatePageNumber();
       this.fillPagesList();
     }
    })
 }

 

 searchCustomers() {
  console.log("hereeeeeeeeeeeeeeeeee>>>>>>>>"+this._Icustomfilter._PNam);
  this._Icustomfilter._pageIndex=1;
  this._StoresService.GetAllStoresFiltered(this._Icustomfilter).subscribe({
    next: (res) => {
      this._stores = res;
      console.log( this._stores);
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
  this.responsePages= Math.ceil(this._stores.count / this._stores.pageSize);
  
  console.log("pgIndx="+this._stores.pageIndex + "pgcount="+this._stores.count)
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
   
  this._StoresService.GetAllStoresFiltered(this._Icustomfilter).subscribe({
    next: (res) => {
      this._stores = res;
      console.log( this._stores);
      this.calculatePageNumber();
      
    },

    error: (err) => {
      console.error('Error fetching customers:', err);
    }

  });
}

clearFilter(){

  this._Icustomfilter = {
    _strCd:'' as string | undefined,
    _StrNm:'' as string |undefined,
    _PNam:'' as string | undefined,
    _Sort:'' as string | undefined,
    _pageIndex:undefined as number | undefined,
    _pageSize:undefined as number | undefined 
  };
  this.searchCustomers();
}


getCustomerById(id:string , name:string){

this.isEdited=0

this.curr_EditedCtg_name=name
this.curr_EditedCtrg_Id=id

 /* this._CategoriesService.getCtgById(id).subscribe({
    next:(res)=>{
      console.log("edite Customer = res "+ res.data.id);

      this._itemsService.currentEditeItem=res.data
      console.log("edite Customer _customerservice.currentEditeCustomer = "+ this._itemsService.currentEditeItem.id);
      this._route.navigate(['/itemdedite']);
    }

  
 
  })*/
  
}


getCustomerById_ShowDetails(id:number){
/*
  this._itemsService.getItemById(id).subscribe({
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


softDelete(){

  console.log("this.isDeleted = " +this.isDeleted)
  console.log("this.deletedCustomer = " +this.deletedCustomer)
  this._StoresService.DeleteStore(this.deletedCustomer).subscribe({

    next:(res)=>{
      console.log(res)
      this.isDeleted=-1
      this.deletedCustomer=-1
      this._ToastrService.info("تم مسح المخزن بنجاح" , "مسح المخزن")
    }
    
  })
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

dontEdite(){
  this.isEdited=-1
}

gotoAddClient(){
  this._route.navigate(['/itemsadd']);
}



updateCtgData(){
  
  this.editedData={"ctgName":this.curr_EditedCtg_name}
  this._StoresService.UpdateStoreData(this.curr_EditedCtrg_Id ,this.editedData).subscribe({
    next:(res)=>{
      this.isEdited=-1

      console.log(res)
      this._ToastrService.info("تم تعديل البيانات بنجاح" , "تعديل البيانات")
      this.isEdited=-1
      this.curr_EditedCtg_name=""
      this.curr_EditedCtrg_Id=-1
      this.isEdited=-1
      this.editedData={}
      
    }
  })
}

dontUpdate(){
  this.isEdited=-1
  this.curr_EditedCtg_name=""
  this.curr_EditedCtrg_Id=-1
  this.isEdited=-1
  this.editedData={}
}


gotoAddComponent(){//is called when click the trash button   <i class="fas fa-trash"></i>
  // set the customer id to be deleted  - 
  this._route.navigate(['/AddNewStore'])
  }

AddNewCtg(){
  
  this.AddedData={"ctgName":this.curr_AddededCtg_name  ,   "ctgId":this.curr_AddedCtrg_Id}
  this._StoresService.AddnewStore(this.AddedData).subscribe({
    next:(res)=>{
      console.log(res)
      this._ToastrService.info("تم اضافة الفئة بنجاح")

 this.isAdded=-1 //this means there is a customer is set to be deleted when == 0
  this.curr_AddedCtrg_Id =undefined
  this.curr_AddededCtg_name=""
  this.AddedData={}
    }
  })
}

dontAdd(){
  this.isAdded=-1
}


findCtg:any
_findCtgId:number|undefined
_findCtgName!:string
showCtg(ctgId:string){
  this.isShowed=0

this.findCtg={"catigoryID":ctgId}

  this._StoresService.GetAllStoresFiltered(this.findCtg).subscribe({
    next: (res) => {
    this._findCtgName= res.data.data[0].ctgName
    this._findCtgId=res.data.data[0].id
      console.log( this._stores);
      
     }
      
    });

}

dontShowCtg(){
  this._findCtgId=undefined
this._findCtgName=""
this.isShowed=-1
}

}
