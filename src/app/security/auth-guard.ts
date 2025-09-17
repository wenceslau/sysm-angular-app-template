import {CanActivateFn, Router} from '@angular/router';
import {AuthManagerService} from './auth-manager.service';
import {inject} from '@angular/core';

export const AuthGuard: CanActivateFn = () => {
  const authManager = inject(AuthManagerService);
  const router = inject(Router);

  if (authManager.isAuthenticated()){
    return true;
  }

  //router.navigate(['/login']);

  return true;
}
