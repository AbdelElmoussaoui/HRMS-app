import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

import { DashboardDataService, DashboardStats } from '../services/dashboard-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  stats?: DashboardStats;
  loading = false;

  @ViewChild('leaveChart') leaveChart!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  constructor(private dashboardData: DashboardDataService) {}

  ngAfterViewInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.dashboardData.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
        this.renderChart(stats);
      },
      error: () => { this.loading = false; }
    });
  }

  private renderChart(stats: DashboardStats): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.leaveChart.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
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
            labels: {
              padding: 16,
              font: { family: "'Inter', sans-serif", size: 13 }
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed}`
            }
          }
        }
      }
    });
  }
}
