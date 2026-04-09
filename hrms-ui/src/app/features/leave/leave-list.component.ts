import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LeaveRequestApiService } from '../services/leave-request-api.service';
import { LeaveRequestResponse } from '../models/leave-request.model';

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss']
})
export class LeaveListComponent implements OnInit {
  displayedColumns = ['employee', 'type', 'dates', 'status', 'actions'];
  dataSource: LeaveRequestResponse[] = [];
  loading = false;

  constructor(private leaveApi: LeaveRequestApiService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.leaveApi.getAll().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  create(): void {
    this.router.navigate(['/dashboard/leave/new']);
  }

  edit(request: LeaveRequestResponse): void {
    this.router.navigate(['/dashboard/leave', request.id, 'edit']);
  }

  delete(request: LeaveRequestResponse): void {
    if (!confirm('Delete leave request?')) {
      return;
    }
    this.leaveApi.delete(request.id).subscribe({
      next: () => this.load()
    });
  }
}
