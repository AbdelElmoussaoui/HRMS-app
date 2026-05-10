import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { gsap } from 'gsap';
import { Chart } from 'chart.js/auto';

import { DashboardDataService, DashboardStats } from '../services/dashboard-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  stats?: DashboardStats;
  loading = false;

  // Animated counter values — updated by GSAP, bound in template
  animCount = { employees: 0, pending: 0, approved: 0, rejected: 0 };

  @ViewChild('leaveChart') leaveChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart')  lineChartRef!:  ElementRef<HTMLCanvasElement>;

  private leaveChart?: Chart;
  private lineChart?:  Chart;

  constructor(
    private dashboardData: DashboardDataService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void { this.load(); }

  ngOnDestroy(): void {
    this.leaveChart?.destroy();
    this.lineChart?.destroy();
  }

  load(): void {
    this.loading = true;
    this.animCount = { employees: 0, pending: 0, approved: 0, rejected: 0 };
    this.leaveChart?.destroy();
    this.lineChart?.destroy();

    this.dashboardData.getStats().subscribe({
      next: (stats) => {
        this.stats   = stats;
        this.loading = false;
        setTimeout(() => {
          this.animateDashboard(stats);
          this.renderLeaveChart(stats);
          this.renderLineChart(stats);
        }, 60);
      },
      error: () => { this.loading = false; }
    });
  }

  private animateDashboard(stats: DashboardStats): void {
    const tl = gsap.timeline();

    // ── 1. Stat cards: stagger entrance ──────────────────────
    tl.from('.stat-card', {
      y: 28,
      opacity: 0,
      duration: 0.45,
      stagger: 0.09,
      ease: 'power3.out',
      clearProps: 'transform,opacity'
    });

    // ── 2. Count-up inside Angular zone (triggers CD) ────────
    this.ngZone.run(() => {
      gsap.to(this.animCount, {
        employees: stats.employeeCount,
        pending:   stats.leavePending,
        approved:  stats.leaveApproved,
        rejected:  stats.leaveRejected,
        duration:  1.4,
        ease:      'power3.out',
        delay:     0.15,
        snap:      { employees: 1, pending: 1, approved: 1, rejected: 1 }
      });
    });

    // ── 3. Charts row ─────────────────────────────────────────
    tl.from('.chart-row .mat-mdc-card', {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.out',
      clearProps: 'transform,opacity'
    }, '-=0.1');

    // ── 4. Bottom row cards ───────────────────────────────────
    tl.from('.bottom-row .mat-mdc-card', {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.out',
      clearProps: 'transform,opacity'
    }, '-=0.15');

    // ── 5. Recent activity items (delayed) ────────────────────
    tl.from('.activity-item', {
      x: -20,
      opacity: 0,
      duration: 0.35,
      stagger: 0.07,
      ease: 'power2.out',
      clearProps: 'transform,opacity'
    }, '-=0.1');

    // ── 6. Department bars: grow from left ────────────────────
    tl.from('.dept-bar-fill', {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      clearProps: 'transform'
    }, '-=0.3');
  }

  private renderLeaveChart(stats: DashboardStats): void {
    const ctx = this.leaveChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;
    this.leaveChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'Approved', 'Rejected'],
        datasets: [{
          data: [stats.leavePending, stats.leaveApproved, stats.leaveRejected],
          backgroundColor: ['#fef3c7', '#d1fae5', '#fee2e2'],
          borderColor:     ['#f59e0b', '#10b981', '#ef4444'],
          borderWidth: 2,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 16, font: { family: "'Inter', sans-serif", size: 13 } }
          }
        }
      }
    });
  }

  private renderLineChart(stats: DashboardStats): void {
    const ctx = this.lineChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;

    const isDark    = document.body.getAttribute('data-theme') === 'dark';
    const gridColor  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
    const labelColor = isDark ? '#94A3B8' : '#64748B';

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: stats.headcountHistory.map(p => p.month),
        datasets: [{
          label: 'Headcount',
          data:  stats.headcountHistory.map(p => p.count),
          borderColor:     '#10b981',
          backgroundColor: 'rgba(16,185,129,0.10)',
          borderWidth: 2.5,
          pointBackgroundColor: '#10b981',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: labelColor, font: { family: "'Inter', sans-serif", size: 12 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: labelColor, font: { family: "'Inter', sans-serif", size: 12 }, stepSize: 1 }
          }
        }
      }
    });
  }
}