import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

import { EmployeeApiService } from './employee-api.service';
import { LeaveRequestApiService } from './leave-request-api.service';
import { EmployeeResponse } from '../models/employee.model';
import { LeaveRequestResponse } from '../models/leave-request.model';

export interface DashboardStats {
  employeeCount: number;
  leavePending: number;
  leaveApproved: number;
  leaveRejected: number;
  leaveTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {
  constructor(
    private employeeApi: EmployeeApiService,
    private leaveApi: LeaveRequestApiService
  ) {}

  getStats(): Observable<DashboardStats> {
    return forkJoin({
      employees: this.employeeApi.getAll(),
      leaves: this.leaveApi.getAll()
    }).pipe(
      map(({ employees, leaves }) => this.computeStats(employees, leaves))
    );
  }

  private computeStats(employees: EmployeeResponse[], leaves: LeaveRequestResponse[]): DashboardStats {
    const leavePending = leaves.filter((r) => r.status === 'PENDING').length;
    const leaveApproved = leaves.filter((r) => r.status === 'APPROVED').length;
    const leaveRejected = leaves.filter((r) => r.status === 'REJECTED').length;

    return {
      employeeCount: employees.length,
      leavePending,
      leaveApproved,
      leaveRejected,
      leaveTotal: leaves.length
    };
  }
}
