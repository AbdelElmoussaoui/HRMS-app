import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly KEY = 'hrms-dark-mode';
  isDark = false;

  constructor() {
    this.isDark = localStorage.getItem(this.KEY) === 'true';
    this.apply();
  }

  toggle(): void {
    this.isDark = !this.isDark;
    localStorage.setItem(this.KEY, String(this.isDark));
    this.apply();
  }

  private apply(): void {
    document.body.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
  }
}