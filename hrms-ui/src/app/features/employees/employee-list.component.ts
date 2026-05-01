import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EmployeeApiService } from '../services/employee-api.service';
import { EmployeeResponse } from '../models/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['avatar', 'name', 'email', 'department', 'status', 'actions'];
  dataSource = new MatTableDataSource<EmployeeResponse>();
  loading  = false;
  isMobile = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)      sort!: MatSort;

  private destroy$ = new Subject<void>();

  constructor(
    private employeeApi: EmployeeApiService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.load();
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => { this.isMobile = result.matches; });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort      = this.sort;
    this.dataSource.filterPredicate = (row, filter) =>
      `${row.firstName} ${row.lastName} ${row.email} ${row.departmentName ?? ''}`.toLowerCase().includes(filter);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.loading = true;
    this.employeeApi.getAll().subscribe({
      next: (data) => { this.dataSource.data = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  initials(row: EmployeeResponse): string {
    return `${row.firstName?.charAt(0) ?? ''}${row.lastName?.charAt(0) ?? ''}`.toUpperCase();
  }

  create(): void { this.router.navigate(['/dashboard/employees/new']); }

  edit(emp: EmployeeResponse): void {
    this.router.navigate(['/dashboard/employees', emp.id, 'edit']);
  }

  delete(emp: EmployeeResponse): void {
    if (!confirm(`Delete ${emp.firstName} ${emp.lastName}?`)) return;
    this.employeeApi.delete(emp.id).subscribe({ next: () => this.load() });
  }
}