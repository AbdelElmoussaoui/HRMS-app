import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

import { EmployeeApiService } from './employee-api.service';
import { LeaveRequestApiService } from './leave-request-api.service';
import { EmployeeResponse } from '../models/employee.model';
import { LeaveRequestResponse } from '../models/leave-request.model';

export interface RecentLeaveItem {
  employeeName: string;
  initials: string;
  type: 'ANNUAL' | 'SICK' | 'UNPAID';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  startDate: string;
}

export interface MonthPoint {
  month: string;
  count: number;
}

export interface DeptCount {
  name: string;
  count: number;
  percentage: number;
}

export interface DashboardStats {
  employeeCount:  number;
  leavePending:   number;
  leaveApproved:  number;
  leaveRejected:  number;
  leaveTotal:     number;
  newThisMonth:   number;
  recentLeaves:   RecentLeaveItem[];
  headcountHistory: MonthPoint[];
  topDepartments: DeptCount[];
}

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  constructor(
    private employeeApi: EmployeeApiService,
    private leaveApi:    LeaveRequestApiService
  ) {}

  getStats(): Observable<DashboardStats> {
    return forkJoin({
      employees: this.employeeApi.getAll(),
      leaves:    this.leaveApi.getAll()
    }).pipe(
      map(({ employees, leaves }) => this.compute(employees, leaves))
    );
  }

  private compute(employees: EmployeeResponse[], leaves: LeaveRequestResponse[]): DashboardStats {
    const now       = new Date();
    const thisMonth = now.getMonth();
    const thisYear  = now.getFullYear();

    const leavePending  = leaves.filter(r => r.status === 'PENDING').length;
    const leaveApproved = leaves.filter(r => r.status === 'APPROVED').length;
    const leaveRejected = leaves.filter(r => r.status === 'REJECTED').length;

    const newThisMonth = employees.filter(e => {
      const d = new Date(e.hireDate);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    const recentLeaves = [...leaves]
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 5)
      .map(l => ({
        employeeName: l.employeeName ?? `Employee #${l.employeeId}`,
        initials:     this.initials(l.employeeName),
        type:         l.type,
        status:       l.status,
        startDate:    l.startDate
      }));

    const headcountHistory = this.buildHeadcount(employees, 6);
    const topDepartments   = this.buildTopDepts(employees, 3);

    return {
      employeeCount: employees.length,
      leavePending, leaveApproved, leaveRejected,
      leaveTotal:    leaves.length,
      newThisMonth, recentLeaves, headcountHistory, topDepartments
    };
  }

  private buildHeadcount(employees: EmployeeResponse[], months: number): MonthPoint[] {
    const points: MonthPoint[] = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const count = employees.filter(e => new Date(e.hireDate) <= endOfMonth).length;
      points.push({
        month: d.toLocaleString('default', { month: 'short' }),
        count
      });
    }
    return points;
  }

  private buildTopDepts(employees: EmployeeResponse[], top: number): DeptCount[] {
    const map = new Map<string, number>();
    employees.forEach(e => {
      const key = e.departmentName ?? 'Unknown';
      map.set(key, (map.get(key) ?? 0) + 1);
    });

    const sorted = [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, top);

    const max = sorted[0]?.[1] ?? 1;
    return sorted.map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / max) * 100)
    }));
  }

  private initials(name: string | undefined): string {
    if (!name) return '?';
    return name.split(' ').map(w => w.charAt(0)).join('').slice(0, 2).toUpperCase();
  }
}