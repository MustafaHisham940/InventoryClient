import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoresService } from '../../core/services/stores.service';
import { StoreScope, StoreScopeService } from '../../core/services/store-scope.service';

/**
 * Store control of the report screens, driven by the store claims of the login token:
 *  - MultiStore = false -> a locked (disabled) text box holding the user's own SingleStoreCode
 *    plus a badge with the SingleStoreName; the value can't be changed.
 *  - MultiStore = true  -> a dropdown of every store (optionally with an "all stores" entry).
 *
 * Use it inside <app-report-shell> (that is where the `rpt-` styles come from) and always build the
 * request with StoreScopeService.effectiveCode(), so the lock also holds if the page is tampered with.
 */
@Component({
  selector: 'app-store-scope-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="rpt-field">
      <label [attr.for]="inputId">{{ label }}</label>

      @if (scope.canPickStore) {
        <div class="rpt-select">
          <i class="fas fa-warehouse"></i>
          <select
            [id]="inputId"
            [ngModel]="storeCode"
            (ngModelChange)="onPick($event)"
            (blur)="touched = true"
            [class.rpt-invalid]="showRequiredError">
            @if (allowAll) {
              <option [ngValue]="null">{{ allLabel }}</option>
            } @else {
              <option value="" disabled>اختر المخزن</option>
            }
            @for (store of storesList; track store.strCd) {
              <option [value]="store.strCd">{{ store.strCd }} - {{ store.strNm }}</option>
            }
          </select>
        </div>
        @if (showRequiredError) {
          <small class="rpt-error">يجب اختيار المخزن</small>
        }
      } @else {
        <div class="rpt-locked">
          <i class="fas fa-lock"></i>
          <input
            [id]="inputId"
            type="text"
            class="rpt-input"
            [value]="scope.singleStoreCode ?? ''"
            disabled
            readonly>
        </div>
        @if (scope.singleStoreCode) {
          <span class="rpt-store-badge" title="المخزن المصرّح لك بالعمل عليه">
            <i class="fas fa-warehouse"></i>
            <span>{{ scope.singleStoreName || scope.singleStoreCode }}</span>
          </span>
        } @else {
          <small class="rpt-error">لم يتم تحديد مخزن لحسابك، يرجى مراجعة المسؤول</small>
        }
      }
    </div>
  `
})
export class StoreScopeFieldComponent implements OnInit {

  private _StoresService = inject(StoresService);
  private _StoreScopeService = inject(StoreScopeService);

  @Input() label = 'كود المخزن';
  /** adds an "all stores" entry (value null) for multi-store users */
  @Input() allowAll = false;
  @Input() allLabel = 'جميع المخازن';
  @Input() inputId = 'storeCode';
  @Input() storeCode: string | null = null;
  @Output() storeCodeChange = new EventEmitter<string | null>();

  scope: StoreScope = this._StoreScopeService.getScope();
  storesList: { strCd: string, strNm: string }[] = [];
  touched = false;

  get showRequiredError(): boolean {
    return !this.allowAll && this.touched && !this.storeCode;
  }

  ngOnInit(): void {
    // single-store users never need the list - they can't pick anything
    if (this.scope.canPickStore) {
      this._StoresService.GetStoresLookupList().subscribe({
        next: (res) => this.storesList = res.data ?? []
      });
    }
  }

  onPick(value: string | null): void {
    this.touched = true;
    this.storeCode = value;
    this.storeCodeChange.emit(value);
  }
}
