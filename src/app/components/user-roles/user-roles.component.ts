import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserRolesService } from '../../core/services/user-roles.service';

/** one configurable role (admin / manager / cashier ...) with its on/off switch for the user being edited */
interface RoleToggle {
  id: number;
  name: string;
  isSuperAdmin: boolean;
  isDefault: boolean;
  pagesCount: number;
  usersCount: number;
  isActive: boolean;
}

/**
 * Roles of one user. The roles themselves (and the pages each one opens) are managed on the
 * "الأدوار والصلاحيات" screen; here a user is switched on/off for each role. A user can hold several roles.
 */
@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.css'
})
export class UserRolesComponent implements OnInit {

  _roles: { data: RoleToggle[], count: number } = {
    data: [],
    count: 0
  };

  userName = '';
  loading = true;
  saving = false;
  /** role ids the user held when the screen opened - used to tell whether anything changed */
  private initialIds: number[] = [];

  constructor(
    private _userRolesService: UserRolesService,
    private _toastr: ToastrService,
    private router: Router
  ) {
    const navState = this.router.getCurrentNavigation()?.extras.state;
    this.userName = navState?.['userName'] ?? '';
    if (this.userName == '') {
      this.router.navigate(['/UserDetails']);
    }
  }

  ngOnInit(): void {
    if (this.userName == '') {
      return;
    }

    this._userRolesService.getRoles().subscribe({
      next: (rolesRes) => {
        this._roles = {
          data: rolesRes.data.map(r => ({
            id: r.id, name: r.name, isSuperAdmin: r.isSuperAdmin, isDefault: r.isDefault,
            pagesCount: r.pagesCount, usersCount: r.usersCount, isActive: false
          })),
          count: rolesRes.count
        };

        this._userRolesService.getUserRoleIds(this.userName).subscribe({
          next: (userRes) => {
            this._roles.data.forEach(r => r.isActive = userRes.data.includes(r.id));
            this.initialIds = [...userRes.data];
            this.loading = false;
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  get selectedCount(): number {
    return this._roles.data.filter(r => r.isActive).length;
  }

  /** true when the switches differ from what is saved */
  hasChanges(): boolean {
    const now = this._roles.data.filter(r => r.isActive).map(r => r.id).sort();
    const before = [...this.initialIds].sort();
    return now.length !== before.length || now.some((id, i) => id !== before[i]);
  }

  updateUserRole(_userName: string) {
    const roleIds = this._roles.data.filter(r => r.isActive).map(r => r.id);

    this.saving = true;
    this._userRolesService.setUserRoles(_userName, roleIds).subscribe({
      next: (res) => {
        this._toastr.success(res.message);
        this.initialIds = roleIds;
        this.saving = false;
        this.router.navigate(['/UserDetails']);
      },
      error: (err) => {
        this.saving = false;
        this._toastr.error(err.error?.message ?? 'تعذر تحديث الأدوار');
      }
    });
  }

  gotoRolesPage() {
    this.router.navigate(['/UserDetails']);
  }

  gotoManageRoles() {
    this.router.navigate(['/RolePermissions']);
  }
}
