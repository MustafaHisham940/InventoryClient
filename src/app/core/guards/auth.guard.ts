import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _tokenService = inject(TokenService)
  
  if(sessionStorage.getItem('token') ){
var tokeeeeem =_tokenService.GetUSerStatus()
console.log('tokeem ' + tokeeeeem)
    if(String(tokeeeeem).toLowerCase()=== "true".toLowerCase() ){
      console.log('return trueeeeeeeeeeeee')
      return true;
    }
    else{
      console.log('return falseeeeeeeeeeeeeeeeeeeee one')

      return false;
    }
    
  }
  else{
    console.log('return falseeeeeeeeeeeeeeeeeeeee two')

    return false;
  }
};
