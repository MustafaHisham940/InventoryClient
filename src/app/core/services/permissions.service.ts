import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { UserRolesService } from './user-roles.service';

const PAGES_KEY = 'pages';
const ALL_PAGES = '*';

/**
 * What the logged-in user may open, decided by the roles they hold (admin / manager / cashier ...).
 * The allowed page keys come from the API at login (and are re-fetched when missing) and are kept in
 * sessionStorage next to the token, so route guards can answer without waiting for a request.
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private _TokenService: TokenService, private _UserRolesService: UserRolesService) { }

  /** called right after login with the pages returned by the login endpoint */
  store(pages: string[] | null | undefined): void {
    try {
      sessionStorage.setItem(PAGES_KEY, JSON.stringify(pages ?? []));
    } catch { /* storage unavailable: the guard will fetch instead */ }
  }

  clear(): void {
    sessionStorage.removeItem(PAGES_KEY);
  }

  private read(): string[] | null {
    const raw = sessionStorage.getItem(PAGES_KEY);
    if (raw === null) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  private isAllowed(pages: string[], key: string): boolean {
    return pages.includes(ALL_PAGES) || pages.includes(key);
  }

  /** true when one of the user's roles allows the page; fetches the user's pages once if they are not cached yet */
  canAccess(key: string): Observable<boolean> {
    const cached = this.read();
    if (cached !== null) {
      return of(this.isAllowed(cached, key));
    }

    const userName = this._TokenService.getusername();
    if (!userName) {
      return of(false);
    }

    return this._UserRolesService.getUserAccess(userName).pipe(
      tap(res => this.store(res.data.pages)),
      map(res => this.isAllowed(res.data.pages, key)),
      catchError(() => of(false))
    );
  }

  /** synchronous check for templates / menus (false until the pages are loaded) */
  has(key: string): boolean {
    const cached = this.read();
    return cached !== null && this.isAllowed(cached, key);
  }
}
