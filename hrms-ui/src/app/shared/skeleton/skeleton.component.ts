import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  template: `<div class="skeleton-item" [class]="'variant-' + variant" [style.width]="width" [style.height]="height"></div>`,
  styles: [`
    .skeleton-item {
      background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
      border-radius: 8px;
      display: block;
    }
    .variant-circle { border-radius: 50%; }
    .variant-text { border-radius: 4px; }
    .variant-rect { border-radius: 8px; }

    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    :host-context([data-theme="dark"]) .skeleton-item {
      background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
      background-size: 200% 100%;
    }
  `]
})
export class SkeletonComponent {
  @Input() width  = '100%';
  @Input() height = '16px';
  @Input() variant: 'rect' | 'text' | 'circle' = 'rect';
}