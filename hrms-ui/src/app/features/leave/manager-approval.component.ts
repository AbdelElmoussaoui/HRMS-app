import { Component, OnInit } from '@angular/core';

import { LeaveRequestApiService } from '../services/leave-request-api.service';
import { LeaveRequestResponse } from '../models/leave-request.model';

@Component({
  selector: 'app-manager-approval',
  templateUrl: './manager-approval.component.html',
  styleUrls: ['./manager-approval.component.scss']
})
export class ManagerApprovalComponent implements OnInit {
  displayedColumns = ['employee', 'type', 'dates', 'reason', 'actions'];
  dataSource: LeaveRequestResponse[] = [];
  loading = false;

  constructor(private leaveApi: LeaveRequestApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.leaveApi.getAll().subscribe({
      next: (data) => {
        this.dataSource = data.filter((request) => request.status === 'PENDING');
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  approve(request: LeaveRequestResponse): void {
    this.leaveApi.approve(request.id).subscribe({
      next: () => this.load()
    });
  }

  reject(request: LeaveRequestResponse): void {
    this.leaveApi.reject(request.id).subscribe({
      next: () => this.load()
    });
  }
}
