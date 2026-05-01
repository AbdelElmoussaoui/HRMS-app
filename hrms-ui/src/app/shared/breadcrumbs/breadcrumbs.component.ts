import { Component, Input } from '@angular/core';

export interface Crumb {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  template: `
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ng-container *ngFor="let crumb of crumbs; let last = last; let i = index">
        <mat-icon *ngIf="i > 0" class="crumb-sep">chevron_right</mat-icon>
        <a class="crumb" [class.crumb-active]="last" [routerLink]="last ? null : crumb.route">
          {{ crumb.label }}
        </a>
      </ng-container>
    </nav>
  `,
  styles: [`
    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 2px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    .crumb {
      display: inline-flex;
      align-items: center;
      font-size: 13px;
      color: var(--hrms-muted);
      text-decoration: none;
      transition: color 0.15s ease;
    }
    .crumb:not(.crumb-active) { cursor: pointer; }
    .crumb:not(.crumb-active):hover { color: var(--hrms-primary); }
    .crumb.crumb-active {
      color: var(--hrms-text);
      font-weight: 500;
      pointer-events: none;
    }
    .crumb-sep {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--hrms-border);
      flex-shrink: 0;
    }
  `]
})
export class BreadcrumbsComponent {
  @Input() crumbs: Crumb[] = [];
}