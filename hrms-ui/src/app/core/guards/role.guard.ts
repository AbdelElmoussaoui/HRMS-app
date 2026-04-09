import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { AuthService } from '../../auth/services/auth.service';
import { decodeJwt, isTokenExpired } from '../../auth/services/jwt.util';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const token = this.authService.getToken();
    if (!token || isTokenExpired(token)) {
      return this.router.parseUrl('/auth/login');
    }

    const roles = (route.data['roles'] as string[]) || [];
    if (!roles.length) {
      return true;
    }

    const payload = decodeJwt(token);
    const tokenRoles = payload?.roles || [];
    const hasRole = roles.some((role) => tokenRoles.includes(role));

    return hasRole ? true : this.router.parseUrl('/auth/login');
  }
}
