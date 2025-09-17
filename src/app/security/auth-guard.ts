import {CanActivateFn, Router} from '@angular/router';
import {AuthManagerService} from './auth-manager.service';
import {inject} from '@angular/core';

export const AuthGuard: CanActivateFn = () => {
  const authManager = inject(AuthManagerService);
  const router = inject(Router);

  if (authManager.isAuthenticated()){
    return true;
  }

  // TODO: commented only in dev mode. Change to login page in prod
  // router.navigate(['/login']);

  // TODO: return true only in dev mode, change to false in prod
  return true;
}
