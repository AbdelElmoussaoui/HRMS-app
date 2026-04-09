import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

import { AuthService } from '../../auth/services/auth.service';
import { decodeJwt } from '../../auth/services/jwt.util';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  username = '';
  userInitial = '?';

  navItems: NavItem[] = [
    { label: 'Dashboard',   icon: 'dashboard',       route: '/dashboard/dashboard'   },
    { label: 'Employees',   icon: 'people',           route: '/dashboard/employees'   },
    { label: 'Departments', icon: 'business',         route: '/dashboard/departments' },
    { label: 'Leave',       icon: 'event_available',  route: '/dashboard/leave'       },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const payload = decodeJwt(token);
      this.username = payload?.sub ?? 'User';
      this.userInitial = this.username.charAt(0).toUpperCase();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
