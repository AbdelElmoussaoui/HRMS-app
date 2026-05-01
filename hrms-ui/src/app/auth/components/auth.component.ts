import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  template: `
    <div class="auth-shell">

      <!-- Left branding panel -->
      <div class="auth-brand">
        <div class="brand-content">
          <app-logo [size]="60"></app-logo>
          <h1 class="brand-title">HRMS</h1>
          <p class="brand-subtitle">Human Resource Management System</p>

          <div class="brand-features">
            <div class="feature-item">
              <mat-icon>people</mat-icon>
              <span>Employee Management</span>
            </div>
            <div class="feature-item">
              <mat-icon>business</mat-icon>
              <span>Department Organizer</span>
            </div>
            <div class="feature-item">
              <mat-icon>event_available</mat-icon>
              <span>Leave &amp; Approvals</span>
            </div>
            <div class="feature-item">
              <mat-icon>show_chart</mat-icon>
              <span>Live Dashboard</span>
            </div>
          </div>

          <!-- Demo credentials badge -->
          <div class="demo-badge">
            <mat-icon>info_outline</mat-icon>
            <div>
              <div class="demo-label">Demo credentials</div>
              <div class="demo-creds">admin / admin123</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right form panel -->
      <div class="auth-form-panel">
        <mat-card class="auth-card">

          <div class="card-header">
            <div class="card-logo">
              <mat-icon>lock_outline</mat-icon>
            </div>
            <h2>Welcome back</h2>
            <p>Sign in to your HRMS account</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <mat-icon matPrefix class="field-icon">person_outline</mat-icon>
              <input matInput formControlName="username" autocomplete="username" />
              <mat-error *ngIf="form.get('username')?.hasError('required')">
                Username is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix class="field-icon">lock_outline</mat-icon>
              <input matInput [type]="showPassword ? 'text' : 'password'"
                     formControlName="password" autocomplete="current-password" />
              <button mat-icon-button matSuffix type="button"
                      (click)="showPassword = !showPassword"
                      [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'">
                <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="form.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <div class="error-banner" *ngIf="error">
              <mat-icon>error_outline</mat-icon>
              <span>{{ error }}</span>
            </div>

            <button mat-raised-button color="primary" type="submit"
                    class="submit-btn"
                    [disabled]="form.invalid || loading">
              <mat-icon *ngIf="!loading">login</mat-icon>
              <mat-spinner *ngIf="loading" diameter="18" class="spinner"></mat-spinner>
              <span>{{ loading ? 'Signing in…' : 'Sign in' }}</span>
            </button>
          </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .auth-shell {
      min-height: 100vh;
      display: flex;
    }

    /* ── Left brand panel ── */
    .auth-brand {
      flex: 1;
      background: linear-gradient(145deg, #0F172A 0%, #0d2a20 55%, #065f46 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px;
      position: relative;
      overflow: hidden;
    }

    .auth-brand::before {
      content: '';
      position: absolute;
      width: 480px; height: 480px;
      border-radius: 50%;
      background: rgba(16,185,129,0.06);
      top: -120px; right: -140px;
    }

    .auth-brand::after {
      content: '';
      position: absolute;
      width: 280px; height: 280px;
      border-radius: 50%;
      background: rgba(16,185,129,0.05);
      bottom: -60px; left: -60px;
    }

    .brand-content {
      position: relative;
      z-index: 1;
      max-width: 340px;
    }

    .brand-title {
      margin: 20px 0 8px;
      font-size: 40px;
      font-weight: 800;
      color: #fff;
      letter-spacing: 0.04em;
      font-family: 'Space Grotesk', sans-serif;
    }

    .brand-subtitle {
      margin: 0 0 36px;
      font-size: 15px;
      color: rgba(255,255,255,0.55);
      line-height: 1.5;
    }

    .brand-features {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 32px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: rgba(255,255,255,0.72);
      font-size: 14px;
      font-weight: 500;
    }

    .feature-item mat-icon {
      font-size: 18px; width: 18px; height: 18px;
      color: #6ee7b7;
    }

    /* Demo badge */
    .demo-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(16,185,129,0.12);
      border: 1px solid rgba(16,185,129,0.25);
      border-radius: 12px;
      padding: 12px 14px;
    }

    .demo-badge mat-icon {
      font-size: 18px; width: 18px; height: 18px;
      color: #6ee7b7;
      flex-shrink: 0;
    }

    .demo-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #6ee7b7;
      margin-bottom: 2px;
    }

    .demo-creds {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255,255,255,0.85);
      font-family: 'Courier New', monospace;
    }

    /* ── Right form panel ── */
    .auth-form-panel {
      width: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 32px;
      background: var(--hrms-bg);
      transition: background-color 0.25s ease;
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      border-radius: 20px !important;
      box-shadow: var(--hrms-shadow-lg) !important;
      border: 1px solid var(--hrms-border) !important;
      background: var(--hrms-card) !important;
      padding: 32px !important;
    }

    .card-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .card-logo {
      width: 52px; height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, #10b981, #059669);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .card-logo mat-icon {
      color: #fff;
      font-size: 26px; width: 26px; height: 26px;
    }

    .card-header h2 {
      margin: 0 0 6px;
      font-size: 22px;
      font-weight: 700;
      color: var(--hrms-text);
      font-family: 'Space Grotesk', sans-serif;
    }

    .card-header p {
      margin: 0;
      font-size: 14px;
      color: var(--hrms-muted);
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .full-width { width: 100%; }

    .field-icon {
      color: var(--hrms-muted);
      font-size: 20px;
      margin-right: 8px;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fee2e2;
      color: #991b1b;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 13px;
      margin: 4px 0;
    }

    .error-banner mat-icon {
      font-size: 18px; width: 18px; height: 18px;
      flex-shrink: 0;
    }

    .submit-btn {
      margin-top: 8px;
      height: 46px;
      font-size: 15px;
      font-weight: 600;
      border-radius: 12px !important;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .spinner { margin-right: 4px; }

    @media (max-width: 768px) {
      .auth-brand      { display: none; }
      .auth-form-panel { width: 100%; padding: 24px 16px; }
    }
  `]
})
export class AuthComponent {
  loading      = false;
  error        = '';
  showPassword = false;

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error   = '';

    const { username, password } = this.form.getRawValue();
    this.authService.login({ username, password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.loading = false;
        this.error = 'Invalid username or password. Please try again.';
      }
    });
  }
}