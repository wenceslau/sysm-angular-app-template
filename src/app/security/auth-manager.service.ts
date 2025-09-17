import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthManagerService {

  private router = inject(Router);

  constructor() {
  }

  isAuthenticated(): boolean {

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }

      const decodedPayload = jwtDecode(token);
      if (!decodedPayload || !decodedPayload.exp) {
        return false;
      }

      const expirationTime = new Date(decodedPayload.exp * 1000);
      if (Date.now() > expirationTime.getTime()) {
        return false;
      }
      console.log(decodedPayload.sub);

      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  revoke() {
    localStorage.removeItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
