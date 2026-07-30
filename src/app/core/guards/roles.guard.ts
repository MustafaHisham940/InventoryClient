import { CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject, Inject } from '@angular/core';

export const rolesGuard: CanActivateFn = (route, state) => {
  
  const _tokenService = inject(TokenService);


  if(sessionStorage.getItem('token')){         
    var UserrolesArr= _tokenService.getRoles();
    var expectedRoles=route.data['roles'] as string[]
    const hasAccess = expectedRoles.some(role=>UserrolesArr?.includes(role))
      if(hasAccess){ return true}
  }


  return false;  
};
