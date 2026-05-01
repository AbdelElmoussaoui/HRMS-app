import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: false,
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" [attr.aria-label]="'HRMS Logo'">
      <rect width="40" height="40" rx="10" fill="url(#logoGrad)"/>
      <!-- H left pillar -->
      <rect x="8" y="11" width="4" height="18" rx="2" fill="white"/>
      <!-- H right pillar -->
      <rect x="18" y="11" width="4" height="18" rx="2" fill="white"/>
      <!-- H crossbar -->
      <rect x="8" y="18.5" width="14" height="3" rx="1.5" fill="white"/>
      <!-- R stem -->
      <rect x="26.5" y="11" width="4" height="18" rx="2" fill="white"/>
      <!-- R bump top arc -->
      <path d="M30.5 11 Q37 11 37 17 Q37 23 30.5 23" stroke="white" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <!-- R diagonal leg -->
      <line x1="30.5" y1="23" x2="36.5" y2="29" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stop-color="#34D399"/>
          <stop offset="1" stop-color="#059669"/>
        </linearGradient>
      </defs>
    </svg>
  `,
  styles: [`:host { display: inline-flex; align-items: center; justify-content: center; }`]
})
export class LogoComponent {
  @Input() size = 38;
}