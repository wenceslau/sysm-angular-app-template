import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthManagerService {

  constructor() { }

  isAuthenticated() {
    return true;
  }
}
