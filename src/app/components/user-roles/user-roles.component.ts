import { Component, OnInit } from '@angular/core';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import { AccountService } from '../../core/services/account.service';
import { Roles, UserRoles } from '../../core/interfaces/iaccount';
import { TokenService } from '../../core/services/token.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [MatCardModule, MatRadioModule, FormsModule, MatCheckboxModule, MatSlideToggleModule],
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.css'
})
export class UserRolesComponent implements OnInit {



_roles:Roles={
  data: [],
  count: 0
}



userName=''

currUserRoles:UserRoles={
  status: false,
  data: [],
  count: 0
}

/**
 *
 */
constructor(private _accountService:AccountService,
  private _tokenService:TokenService,private router:Router
) {
  const navState = this.router.getCurrentNavigation()?.extras.state;
  this.userName = navState?.['userName'] ?? '';  
  if(this.userName == ''){
    this.router.navigate(['/UserDetails'])
  }
}

ngOnInit(): void {
  this._accountService.getAllRoles().subscribe({
    next:(res)=>{
      this._roles=res
    }
  })


  this._accountService.getUserRolesById(this.userName).subscribe({
    next:(res)=>{
      this.currUserRoles=res
      console.log(this.currUserRoles)
      this.CheckuserCurrRoles()
    }
  })

 



}
_rolesData={
  checkedOne:false as boolean,
  checkedTwo:false as boolean,
  checkedThree:false as boolean,
}


newRoles():string[]{
    var newRoles:string[]=[]

    this._roles.data.forEach(element => {
      if(element.isActive == true){
        newRoles.push(element.name)
      }
    });


   

    for (let index = 0; index < newRoles.length; index++) {
    console.log(newRoles[index])
    }

return newRoles;
}

updateUserRole(_userName:string){
  var newRolesparameter=this.newRoles();

  
  this._accountService.updateUserRoles(_userName , newRolesparameter)
  .subscribe({
    next:(res)=>{
      console.log(res)

    }
  })
  this.router.navigate(['/UserDetails'])

}

CheckuserCurrRoles(){


  this.currUserRoles.data.forEach(element => {
   
    this._roles.data.forEach(x => {
      if(x.name.toLowerCase() == element.toLowerCase())
      {
        console.log(`${x.name} == true`)
        x.isActive=true
      }

      
    });

  });
}


gotoRolesPage(){
  this.router.navigate(['/UserDetails'])

}

}
