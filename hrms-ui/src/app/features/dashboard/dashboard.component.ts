import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Chart } from 'chart.js/auto';

import { DashboardDataService, DashboardStats } from '../services/dashboard-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('sectionIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(14px)' }),
        animate('350ms ease-out', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  stats?: DashboardStats;
  loading = false;

  @ViewChild('leaveChart') leaveChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart')  lineChartRef!:  ElementRef<HTMLCanvasElement>;

  private leaveChart?: Chart;
  private lineChart?:  Chart;

  constructor(private dashboardData: DashboardDataService) {}

  ngAfterViewInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.leaveChart?.destroy();
    this.lineChart?.destroy();
  }

  load(): void {
    this.loading = true;
    this.leaveChart?.destroy();
    this.lineChart?.destroy();

    this.dashboardData.getStats().subscribe({
      next: (stats) => {
        this.stats   = stats;
        this.loading = false;
        setTimeout(() => {
          this.renderLeaveChart(stats);
          this.renderLineChart(stats);
        }, 50);
      },
      error: () => { this.loading = false; }
    });
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

    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const gridColor  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
    const labelColor = isDark ? '#94A3B8' : '#64748B';

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: stats.headcountHistory.map(p => p.month),
        datasets: [{
          label: 'Headcount',
          data:  stats.headcountHistory.map(p => p.count),
          borderColor: '#10b981',
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
        plugins: {
          legend: { display: false }
        },
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