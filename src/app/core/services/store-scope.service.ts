import { Injectable, inject } from '@angular/core';
import { TokenService } from './token.service';

/** which stores the logged-in user may report on, read from the login token */
export interface StoreScope {
  /** token.MultiStore === true: the user picks any store from a dropdown */
  canPickStore: boolean;
  /** token.MultiStore === false: the only store the user may use (null for multi-store users) */
  singleStoreCode: string | null;
  singleStoreName: string | null;
}

/** the sysInfo block every report request carries */
export interface ReportSysInfo {
  accptMinus: number;
  multiStore: boolean;
  singleStrCd: string;
  companyName: string;
  storeName: string;
}

/**
 * Single place that interprets the store claims of the JWT (MultiStore / SingleStoreCode / SingleStoreName)
 * so every report screen enforces them the same way.
 *
 * The backend writes the text "null" into the single-store claims of multi-store users and
 * serialises the boolean as "True" / "False", so both are normalised here.
 */
@Injectable({ providedIn: 'root' })
export class StoreScopeService {

  private _TokenService = inject(TokenService);

  private clean(value: string | null | undefined): string | null {
    const text = (value ?? '').toString().trim();
    return !text || text.toLowerCase() === 'null' || text.toLowerCase() === 'undefined' ? null : text;
  }

  getScope(): StoreScope {
    const settings = this._TokenService.GetUserStoreSettings();
    // a token without the claim (or no token at all) behaves like a multi-store user, the column default
    const multi = this.clean(settings?.MultiStore)?.toLowerCase() !== 'false';

    return {
      canPickStore: multi,
      singleStoreCode: multi ? null : this.clean(settings?.SingleStoreCode),
      singleStoreName: multi ? null : this.clean(settings?.SingleStoreName)
    };
  }

  /**
   * Value the store control starts with: a single-store user starts on (and is locked to) their own store,
   * a multi-store user starts on "all stores" (null) when the report supports it, otherwise on nothing ('').
   */
  initialCode(allowAll: boolean): string | null {
    const scope = this.getScope();
    if (!scope.canPickStore) {
      return scope.singleStoreCode ?? '';
    }
    return allowAll ? null : '';
  }

  /** the store code that must go into the request - a single-store user can never send anything but their own */
  effectiveCode(selected: string | null): string | null {
    const scope = this.getScope();
    return scope.canPickStore ? selected : (scope.singleStoreCode ?? '');
  }

  /** true when the store control blocks the search (nothing picked, or a single-store account with no store set) */
  storeError(selected: string | null, allowAll: boolean): boolean {
    const scope = this.getScope();
    if (!scope.canPickStore) {
      return !scope.singleStoreCode;
    }
    return !allowAll && !selected?.trim();
  }

  sysInfo(): ReportSysInfo {
    const scope = this.getScope();
    return {
      accptMinus: 0,
      multiStore: scope.canPickStore,
      singleStrCd: scope.singleStoreCode ?? '',
      companyName: '',
      storeName: scope.singleStoreName ?? ''
    };
  }
}
