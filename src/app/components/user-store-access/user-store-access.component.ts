import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StoresService } from '../../core/services/stores.service';
import { UserStoreAccessService } from '../../core/services/user-store-access.service';

type AccessMode = 'multi' | 'single';

/**
 * Which stores one user works with: every store (multi-store) or exactly one store.
 * The choice is saved on the user and ends up in their login token (MultiStore / SingleStoreCode / SingleStoreName),
 * so it takes effect the next time they log in.
 */
@Component({
  selector: 'app-user-store-access',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-store-access.component.html',
  styleUrl: './user-store-access.component.css'
})
export class UserStoreAccessComponent implements OnInit {

  private _router = inject(Router);
  private _toastr = inject(ToastrService);
  private _storesService = inject(StoresService);
  private _accessService = inject(UserStoreAccessService);

  userName = '';
  mode: AccessMode = 'multi';
  storeCode: string | null = null;
  stores: { strCd: string, strNm: string }[] = [];
  loading = true;
  saving = false;

  constructor() {
    const navState = this._router.getCurrentNavigation()?.extras.state;
    this.userName = navState?.['userName'] ?? '';
    if (this.userName === '') {
      this._router.navigate(['/UserDetails']);
    }
  }

  ngOnInit(): void {
    if (this.userName === '') {
      return;
    }

    this._storesService.GetStoresLookupList().subscribe({
      next: (res) => {
        // "Null" is the placeholder store for vouchers without a store, not a store to work in
        this.stores = (res.data as { strCd: string, strNm: string }[]).filter(s => s.strCd.toLowerCase() !== 'null');
      }
    });

    this._accessService.getAccess(this.userName).subscribe({
      next: (res) => {
        this.mode = res.data.multiStore ? 'multi' : 'single';
        this.storeCode = res.data.singleStoreCode;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this._toastr.error('تعذر تحميل مخازن المستخدم');
      }
    });
  }

  get canSave(): boolean {
    return !this.loading && !this.saving && (this.mode === 'multi' || !!this.storeCode);
  }

  save(): void {
    if (!this.canSave) {
      return;
    }
    this.saving = true;

    this._accessService.setAccess(this.userName, this.mode === 'multi', this.mode === 'single' ? this.storeCode : null).subscribe({
      next: (res) => {
        this._toastr.success(res.message);
        this._router.navigate(['/UserDetails']);
      },
      error: (err) => {
        this.saving = false;
        this._toastr.error(err.error?.message ?? 'تعذر حفظ مخازن المستخدم');
      }
    });
  }

  back(): void {
    this._router.navigate(['/UserDetails']);
  }
}
