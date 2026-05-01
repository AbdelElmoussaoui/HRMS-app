import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { DepartmentApiService } from '../services/department-api.service';
import { DepartmentResponse } from '../models/department.model';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'description', 'actions'];
  dataSource = new MatTableDataSource<DepartmentResponse>();
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)      sort!: MatSort;

  constructor(private departmentApi: DepartmentApiService, private router: Router) {}

  ngOnInit(): void { this.load(); }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort      = this.sort;
    this.dataSource.filterPredicate = (row, filter) =>
      `${row.name} ${row.description ?? ''}`.toLowerCase().includes(filter);
  }

  load(): void {
    this.loading = true;
    this.departmentApi.getAll().subscribe({
      next: (data) => { this.dataSource.data = data; this.loading = false; },
      error: () => (this.loading = false)
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
    if (this.dataSource.paginator) { this.dataSource.paginator.firstPage(); }
  }

  create(): void { this.router.navigate(['dashboard/departments/new']); }

  edit(dept: DepartmentResponse): void {
    this.router.navigate(['dashboard/departments', dept.id, 'edit']);
  }

  delete(dept: DepartmentResponse): void {
    if (!confirm(`Delete ${dept.name}?`)) return;
    this.departmentApi.delete(dept.id).subscribe({ next: () => this.load() });
  }
}