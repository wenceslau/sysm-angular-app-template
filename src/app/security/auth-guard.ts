import {CanActivateFn, Router} from "@angular/router";
import {AuthManager} from "./auth-manager";
import {inject} from "@angular/core";

export const AuthGuard: CanActivateFn = () => {
  const authManager = inject(AuthManager);
  const router = inject(Router);

  // TODO: denied the authentication only in DEV mode
  if (!authManager.isAuthenticated()){
    return true;
  }

  router.navigate(["/login"]);

  return false;
}
