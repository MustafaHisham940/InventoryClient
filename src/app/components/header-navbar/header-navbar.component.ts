import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-header-navbar',
  standalone: true,
  imports: [MatMenuModule,MatButtonModule,MatIconModule],
  templateUrl: './header-navbar.component.html',
  styleUrl: './header-navbar.component.css'
})
export class HeaderNavbarComponent implements OnInit {


 
  constructor( private _router: Router,
    private _TokenService:TokenService
  ) {
   
    
  }
  currdisplayname:any
  currEmail:any

  ngOnInit(): void {
  this.currdisplayname=  this._TokenService.getusername()
  this.currEmail=  this._TokenService.geteMAIL()

  console.log('hereeeeeeeeeeee I am  header navbarrrrrrrrrrrr   =>>>  ' + this.currdisplayname)

  
  }

  logout(){
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('roles')
    this._router.navigate(['/login'])
  }


  showUserData(_username:string){
    this._router.navigate(['/UserDataShow'],{queryParams:{_username}})
  }

  UpdateUserData(_username:string){
    this._router.navigate(['/UserDataUpdate'] , {queryParams:{_username}})
   // this._router.navigate(['/UserDataUpdate', {queryParams:{_username}}] )
  }

  gotoResetPAssword(){
    this._router.navigate(['/resetPassword'])

  }

}
