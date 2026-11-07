import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { PermissionsService } from '../services/permissions.service';

/**
 * Route guard: the user's roles decide. The page key is the route's `data.page` when set,
 * otherwise its path; the route opens only if one of the user's roles allows that page.
 */
export const pageGuard: CanActivateFn = (route) => {
  const permissions = inject(PermissionsService);

  if (!sessionStorage.getItem('token')) {
    return false;
  }

  const key = (route.data?.['page'] as string | undefined) ?? route.routeConfig?.path ?? '';
  return permissions.canAccess(key);
};
