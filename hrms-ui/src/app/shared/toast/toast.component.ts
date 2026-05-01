import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import { ToastService, Toast } from './toast.service';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="toast-container" aria-live="polite">
      <div
        *ngFor="let t of toasts$ | async; trackBy: trackById"
        class="toast"
        [ngClass]="'toast-' + t.type"
        [@toastAnim]>
        <mat-icon class="toast-icon">{{ iconMap[t.type] }}</mat-icon>
        <span class="toast-msg">{{ t.message }}</span>
        <button class="toast-close" (click)="dismiss(t.id)" aria-label="Close">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>
  `,
  animations: [
    trigger('toastAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(110%)' }),
        animate('240ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('180ms ease-in', style({ opacity: 0, transform: 'translateX(110%)' }))
      ])
    ])
  ],
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: 360px;
      width: calc(100vw - 40px);
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      font-size: 14px;
      font-weight: 500;
      backdrop-filter: blur(4px);
    }
    .toast-success { background: #064e3b; color: #6ee7b7; border: 1px solid rgba(110,231,183,0.2); }
    .toast-error   { background: #7f1d1d; color: #fca5a5; border: 1px solid rgba(252,165,165,0.2); }
    .toast-info    { background: #1e293b; color: #93c5fd; border: 1px solid rgba(147,197,253,0.2); }
    .toast-warn    { background: #78350f; color: #fcd34d; border: 1px solid rgba(252,211,77,0.2); }
    .toast-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; }
    .toast-msg { flex: 1; line-height: 1.4; }
    .toast-close {
      background: none; border: none; cursor: pointer;
      color: inherit; opacity: 0.65; padding: 0;
      display: flex; align-items: center; flex-shrink: 0;
      transition: opacity 0.15s ease;
    }
    .toast-close:hover { opacity: 1; }
    .toast-close mat-icon { font-size: 16px; width: 16px; height: 16px; }
  `]
})
export class ToastContainerComponent {
  toasts$ = this.toastService.toasts;

  readonly iconMap: Record<Toast['type'], string> = {
    success: 'check_circle',
    error:   'error',
    info:    'info',
    warn:    'warning'
  };

  constructor(private toastService: ToastService) {}

  trackById(_: number, t: Toast): string { return t.id; }
  dismiss(id: string): void { this.toastService.dismiss(id); }
}