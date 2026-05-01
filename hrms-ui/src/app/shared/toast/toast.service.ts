import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warn';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toasts$ = new BehaviorSubject<Toast[]>([]);
  readonly toasts = this.toasts$.asObservable();

  show(message: string, type: Toast['type'] = 'info'): void {
    const id = Math.random().toString(36).slice(2);
    this.toasts$.next([...this.toasts$.value, { id, message, type }]);
    setTimeout(() => this.dismiss(id), 3500);
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void   { this.show(message, 'error'); }
  info(message: string): void    { this.show(message, 'info'); }
  warn(message: string): void    { this.show(message, 'warn'); }

  dismiss(id: string): void {
    this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
  }
}