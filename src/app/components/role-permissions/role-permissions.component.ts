import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserRole, UserRolesService } from '../../core/services/user-roles.service';
import { AppPage, PAGES, PAGE_GROUPS } from '../../core/permissions/pages-catalog';

interface PageGroupView {
  name: string;
  pages: AppPage[];
}

/**
 * Roles & permissions: create / rename / delete roles (admin, manager, cashier ...) and tick the pages
 * each role may open. A user's access is the union of the pages of the roles they hold.
 */
@Component({
  selector: 'app-role-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-permissions.component.html',
  styleUrl: './role-permissions.component.css'
})
export class RolePermissionsComponent implements OnInit {

  private _UserRolesService = inject(UserRolesService);
  private _ToastrService = inject(ToastrService);

  roles: UserRole[] = [];
  selectedRole: UserRole | null = null;

  // new role / rename form
  roleName = '';
  roleIsSuper = false;
  roleIsDefault = false;
  editingRole = false;

  // page checklist of the selected role
  allowed = new Set<string>();
  search = '';
  private savedSnapshot = '';

  readonly totalPages = PAGES.length;
  readonly groups: PageGroupView[] = PAGE_GROUPS.map(g => ({ name: g, pages: PAGES.filter(p => p.group === g) }));

  ngOnInit(): void {
    this.loadRoles();
  }

  private loadRoles(selectId?: number): void {
    this._UserRolesService.getRoles().subscribe({
      next: (res) => {
        this.roles = res.data;
        const keep = selectId ?? this.selectedRole?.id;
        const next = this.roles.find(r => r.id === keep) ?? null;
        if (next) {
          this.selectRole(next);
        } else {
          this.selectedRole = null;
          this.allowed.clear();
        }
      }
    });
  }

  selectRole(role: UserRole): void {
    this.selectedRole = role;
    this.editingRole = false;
    this.roleName = role.name;
    this.roleIsSuper = role.isSuperAdmin;
    this.roleIsDefault = role.isDefault;
    this.allowed = new Set<string>();

    if (role.isSuperAdmin) {
      this.savedSnapshot = '';
      return;
    }

    this._UserRolesService.getRolePages(role.id).subscribe({
      next: (res) => {
        this.allowed = new Set(res.data);
        this.savedSnapshot = this.snapshot();
      }
    });
  }

  // ----- roles -----

  startAdd(): void {
    this.selectedRole = null;
    this.editingRole = true;
    this.roleName = '';
    this.roleIsSuper = false;
    this.roleIsDefault = false;
    this.allowed = new Set<string>();
  }

  startRename(): void {
    if (!this.selectedRole) return;
    this.editingRole = true;
    this.roleName = this.selectedRole.name;
    this.roleIsSuper = this.selectedRole.isSuperAdmin;
    this.roleIsDefault = this.selectedRole.isDefault;
  }

  cancelEdit(): void {
    this.editingRole = false;
    if (this.selectedRole) {
      this.selectRole(this.selectedRole);
    }
  }

  saveRole(): void {
    const name = this.roleName.trim();
    if (!name) {
      this._ToastrService.warning('يجب ادخال اسم الدور');
      return;
    }

    const request = this.selectedRole
      ? this._UserRolesService.updateRole(this.selectedRole.id, name, this.roleIsSuper, this.roleIsDefault)
      : this._UserRolesService.createRole(name, this.roleIsSuper, this.roleIsDefault);

    request.subscribe({
      next: (res) => {
        this._ToastrService.success(res.message);
        this.editingRole = false;
        this.loadRoles(res.data?.id);
      },
      error: (err) => this._ToastrService.error(err.error?.message ?? 'تعذر حفظ الدور')
    });
  }

  deleteRole(): void {
    if (!this.selectedRole) return;
    if (!confirm(`حذف الدور "${this.selectedRole.name}" ؟`)) return;

    this._UserRolesService.deleteRole(this.selectedRole.id).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message);
        this.selectedRole = null;
        this.loadRoles();
      },
      error: (err) => this._ToastrService.error(err.error?.message ?? 'تعذر حذف الدور')
    });
  }

  // ----- pages -----

  private snapshot(): string {
    return [...this.allowed].sort().join('|');
  }

  get dirty(): boolean {
    return !!this.selectedRole && !this.selectedRole.isSuperAdmin && this.snapshot() !== this.savedSnapshot;
  }

  visiblePages(group: PageGroupView): AppPage[] {
    const q = this.search.trim().toLowerCase();
    return q ? group.pages.filter(p => p.label.toLowerCase().includes(q) || p.key.toLowerCase().includes(q)) : group.pages;
  }

  isChecked(key: string): boolean {
    return this.allowed.has(key);
  }

  toggle(key: string, checked: boolean): void {
    checked ? this.allowed.add(key) : this.allowed.delete(key);
  }

  groupState(group: PageGroupView): 'all' | 'some' | 'none' {
    const count = group.pages.filter(p => this.allowed.has(p.key)).length;
    return count === 0 ? 'none' : count === group.pages.length ? 'all' : 'some';
  }

  toggleGroup(group: PageGroupView, checked: boolean): void {
    group.pages.forEach(p => this.toggle(p.key, checked));
  }

  selectAll(checked: boolean): void {
    PAGES.forEach(p => this.toggle(p.key, checked));
  }

  savePages(): void {
    if (!this.selectedRole) return;

    this._UserRolesService.setRolePages(this.selectedRole.id, [...this.allowed]).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message);
        this.savedSnapshot = this.snapshot();
        this.loadRoles(this.selectedRole!.id);
      },
      error: (err) => this._ToastrService.error(err.error?.message ?? 'تعذر حفظ الصلاحيات')
    });
  }
}
