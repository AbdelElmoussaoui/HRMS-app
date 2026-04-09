import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { EmployeeApiService } from '../services/employee-api.service';
import { EmployeeResponse } from '../models/employee.model';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['avatar', 'name', 'email', 'department', 'status', 'actions'];
  dataSource = new MatTableDataSource<EmployeeResponse>();
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeApi: EmployeeApiService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (row, filter) =>
      `${row.firstName} ${row.lastName} ${row.email} ${row.departmentName ?? ''}`.toLowerCase().includes(filter);
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
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  initials(row: EmployeeResponse): string {
    return `${row.firstName?.charAt(0) ?? ''}${row.lastName?.charAt(0) ?? ''}`.toUpperCase();
  }

  create(): void { this.router.navigate(['/dashboard/employees/new']); }

  edit(employee: EmployeeResponse): void {
    this.router.navigate(['/dashboard/employees', employee.id, 'edit']);
  }

  delete(employee: EmployeeResponse): void {
    if (!confirm(`Delete ${employee.firstName} ${employee.lastName}?`)) return;
    this.employeeApi.delete(employee.id).subscribe({ next: () => this.load() });
  }
}
