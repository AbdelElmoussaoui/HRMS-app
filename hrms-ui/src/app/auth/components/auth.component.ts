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
          <div class="brand-logo">
            <mat-icon>corporate_fare</mat-icon>
          </div>
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
              <span>Leave & Approvals</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right form panel -->
      <div class="auth-form-panel">
        <mat-card class="auth-card">
          <div class="card-header">
            <div class="card-logo">
              <mat-icon>lock</mat-icon>
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
              <span>{{ loading ? 'Signing in...' : 'Sign in' }}</span>
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

    /* Left branding */
    .auth-brand {
      flex: 1;
      background: linear-gradient(145deg, #1a1d2e 0%, #2d3561 60%, #3f51b5 100%);
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
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: rgba(255,255,255,0.03);
      top: -100px;
      right: -150px;
    }

    .auth-brand::after {
      content: '';
      position: absolute;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
      bottom: -60px;
      left: -60px;
    }

    .brand-content {
      position: relative;
      z-index: 1;
      max-width: 340px;
    }

    .brand-logo {
      width: 64px;
      height: 64px;
      border-radius: 18px;
      background: rgba(255,255,255,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      border: 1px solid rgba(255,255,255,0.15);
    }

    .brand-logo mat-icon {
      color: #fff;
      font-size: 34px;
      width: 34px;
      height: 34px;
    }

    .brand-title {
      margin: 0 0 8px;
      font-size: 38px;
      font-weight: 800;
      color: #fff;
      letter-spacing: 0.04em;
    }

    .brand-subtitle {
      margin: 0 0 40px;
      font-size: 15px;
      color: rgba(255,255,255,0.60);
      line-height: 1.5;
    }

    .brand-features {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: rgba(255,255,255,0.75);
      font-size: 14px;
      font-weight: 500;
    }

    .feature-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #a5b4fc;
    }

    /* Right form panel */
    .auth-form-panel {
      width: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 32px;
      background: #f4f5fa;
    }

    .auth-card {
      width: 100%;
      max-width: 400px;
      border-radius: 20px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.10) !important;
      border: 1px solid #e4e6f0;
      padding: 32px !important;
    }

    .card-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .card-logo {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, #5c6bc0, #3f51b5);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .card-logo mat-icon {
      color: #fff;
      font-size: 26px;
      width: 26px;
      height: 26px;
    }

    .card-header h2 {
      margin: 0 0 6px;
      font-size: 22px;
      font-weight: 700;
      color: #1a1d2e;
    }

    .card-header p {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .full-width { width: 100%; }

    .field-icon {
      color: #9ca3af;
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
      font-size: 18px;
      width: 18px;
      height: 18px;
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
      .auth-brand { display: none; }
      .auth-form-panel { width: 100%; padding: 24px 16px; }
    }
  `]
})
export class AuthComponent {
  loading = false;
  error = '';
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
    this.error = '';

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
