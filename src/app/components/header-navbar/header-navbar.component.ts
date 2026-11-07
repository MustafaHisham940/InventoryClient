import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { TokenService } from '../../core/services/token.service';
import { StoreScopeService } from '../../core/services/store-scope.service';
import { PermissionsService } from '../../core/services/permissions.service';

@Component({
  selector: 'app-header-navbar',
  standalone: true,
  imports: [MatMenuModule,MatButtonModule,MatIconModule],
  templateUrl: './header-navbar.component.html',
  styleUrl: './header-navbar.component.css'
})
export class HeaderNavbarComponent implements OnInit {


 
  constructor( private _router: Router,
    private _TokenService:TokenService,
    private _StoreScopeService:StoreScopeService,
    private _PermissionsService:PermissionsService
  ) {
   
    
  }
  currdisplayname:any
  currEmail:any
  /** configurable roles (admin / manager ...) from the login token */
  userRoles: string[] = []
  /** the single role shown in the bar: the admin role for a user with full access, otherwise their first role */
  mainRole: string | null = null
  canPickStore = true
  storeName: string | null = null

  ngOnInit(): void {
  this.currdisplayname=  this._TokenService.getusername()
  this.currEmail=  this._TokenService.geteMAIL()
  this.userRoles = this._TokenService.getUserRoles()
  const fullAccess = this._PermissionsService.has('*')
  this.mainRole = (fullAccess ? this.userRoles.find(r => /admin/i.test(r)) : undefined) ?? this.userRoles[0] ?? null
  const scope = this._StoreScopeService.getScope()
  this.canPickStore = scope.canPickStore
  this.storeName = scope.singleStoreName ?? scope.singleStoreCode

  
  }

  logout(){
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('roles')
    sessionStorage.removeItem('pages')
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
