import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { AuthService } from '../../auth/services/auth.service';
import { isTokenExpired } from '../../auth/services/jwt.util';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = this.authService.getToken();
    if (!token || isTokenExpired(token)) {
      return this.router.parseUrl('/auth/login');
    }
    return true;
  }
}
