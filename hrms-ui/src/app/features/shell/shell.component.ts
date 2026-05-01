import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from '../../auth/services/auth.service';
import { decodeJwt } from '../../auth/services/jwt.util';
import { ThemeService } from '../../shared/services/theme.service';

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
export class ShellComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  username    = '';
  userInitial = '?';
  isMobile    = false;
  sidenavMode: 'side' | 'over' = 'side';

  navItems: NavItem[] = [
    { label: 'Dashboard',   icon: 'dashboard',      route: '/dashboard/dashboard'   },
    { label: 'Employees',   icon: 'people',          route: '/dashboard/employees'   },
    { label: 'Departments', icon: 'business',        route: '/dashboard/departments' },
    { label: 'Leave',       icon: 'event_available', route: '/dashboard/leave'       },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    public  themeService: ThemeService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const payload = decodeJwt(token);
      this.username    = payload?.sub ?? 'User';
      this.userInitial = this.username.charAt(0).toUpperCase();
    }

    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile    = result.matches;
        this.sidenavMode = result.matches ? 'over' : 'side';
        if (this.sidenav) {
          result.matches ? this.sidenav.close() : this.sidenav.open();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNavClick(): void {
    if (this.isMobile) { this.sidenav.close(); }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}