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
@Component({
  selector: 'app-ctg',
  standalone: true,
  imports: [FormsModule , RouterModule,NavbarHoverDirective],
  templateUrl: './ctg.component.html',
  styleUrl: './ctg.component.css'
})
export class CtgComponent implements OnInit{

  isEdited!:number
  curr_EditedCtg_name:string=""
  curr_EditedCtrg_Id:number=-1
  editedData:object={}

  isShowed:number = -1

  isAdded!:number
  curr_AddededCtg_name:string=""
  curr_AddedCtrg_Id:number|undefined
  AddedData:object={}


  
  __iItems: IItems= { data: [] } as any;
  _categories: Categories = {
    status: false,
    errors: null, // or undefined
    message: '',
    data: {
      pageSize: 0,
      pageIndex: 0,
      count: 0,
      data: [] // Empty array for Ctg items
    }
  };

  responsePages!:number
  pagesList: number[] = []
  isDeleted!:number
  deletedCustomer!:number
  private _ToastrService=inject(ToastrService)
   
 // _Icustomerfilter!:Icustomerfilter 

  _Icustomfilter = {
    catigoryID: undefined as number | undefined,      
    catigoryName: '' as string | undefined,
   
    sort: '' as string | undefined,
    PageIndex: undefined as number | undefined,
    PageSize: undefined as number | undefined
  };



  constructor(private _CategoriesService:CategoriesService,
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
    this._Icustomfilter.PageIndex=1;
    this._Icustomfilter.PageSize=5;
    this.isEdited=-1



    this.curr_EditedCtg_name=""
    this.curr_EditedCtrg_Id=-1
    
    this._CategoriesService.getFilteredICtgs(this._Icustomfilter).subscribe({

     next:(res)=>{
      
      this._categories=res
      
       console.log("Welcome!!!!!",res)
       this.calculatePageNumber();
       this.fillPagesList();
     }
    })
 }

 

 searchCustomers() {
  console.log("hereeeeeeeeeeeeeeeeee>>>>>>>>"+this._Icustomfilter.catigoryID);
  this._Icustomfilter.PageIndex=1;
  this._CategoriesService.getFilteredICtgs(this._Icustomfilter).subscribe({
    next: (res) => {
      this._categories = res;
      console.log( this._categories);
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
  this.responsePages= Math.ceil(this._categories.data.count / this._categories.data.pageSize);
  
  console.log("pgIndx="+this._categories.data.pageIndex + "pgcount="+this._categories.data.count)
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
  this._Icustomfilter.PageIndex=pgIdx;
  console.log("currPage=" +this._Icustomfilter.PageIndex );

  this.searchCustomersNofill();
}

/*********************************** **********************/

searchCustomersNofill() {
  console.log(this._Icustomfilter);
   
  this._CategoriesService.getFilteredICtgs(this._Icustomfilter).subscribe({
    next: (res) => {
      this._categories = res;
      console.log( this._categories);
      this.calculatePageNumber();
      
    },

    error: (err) => {
      console.error('Error fetching customers:', err);
    }

  });
}

clearFilter(){

  this._Icustomfilter = {
    catigoryID: undefined as number | undefined,
    catigoryName: '' as string | undefined,
    sort: '' as string | undefined,
    PageIndex: undefined as number | undefined,
    PageSize: undefined as number | undefined
  };
  this.searchCustomers();
}


getCustomerById(id:number , name:string){

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



gotoDeleteComponent(id:number){//is called when click the trash button   <i class="fas fa-trash"></i>
// set the customer id to be deleted  - 
this.isDeleted=0 //this means there is a customer is set to be deleted when == 0
this.deletedCustomer = id
console.log("deleted customers"+this.deletedCustomer)
}


softDelete(){

  console.log("this.isDeleted = " +this.isDeleted)
  console.log("this.deletedCustomer = " +this.deletedCustomer)
  this._CategoriesService.deleteItem(this.deletedCustomer).subscribe({

    next:(res)=>{
      console.log(res)
      this.isDeleted=-1
      this.deletedCustomer=-1
      this._ToastrService.info("تم مسح المنتج بنجاح" , "مسح منتج")
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
  this._CategoriesService.updateCtg(this.curr_EditedCtrg_Id ,this.editedData).subscribe({
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
  this.isAdded=0 //this means there is a customer is set to be deleted when == 0
  
  console.log("deleted customers"+this.deletedCustomer)
  }

AddNewCtg(){
  
  this.AddedData={"ctgName":this.curr_AddededCtg_name  ,   "ctgId":this.curr_AddedCtrg_Id}
  this._CategoriesService.addNewCtg(this.AddedData).subscribe({
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
showCtg(ctgId:number){
  this.isShowed=0

this.findCtg={"catigoryID":ctgId}

  this._CategoriesService.getFilteredICtgs(this.findCtg).subscribe({
    next: (res) => {
    this._findCtgName= res.data.data[0].ctgName
    this._findCtgId=res.data.data[0].id
      console.log( this._categories);
      
     }
      
    });

}

dontShowCtg(){
  this._findCtgId=undefined
this._findCtgName=""
this.isShowed=-1
}

}
