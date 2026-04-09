import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DepartmentApiService } from '../services/department-api.service';
import { DepartmentResponse } from '../models/department.model';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {
  displayedColumns = ['id', 'name', 'description', 'actions'];
  dataSource: DepartmentResponse[] = [];
  loading = false;

  constructor(private departmentApi: DepartmentApiService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.departmentApi.getAll().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  create(): void {
    this.router.navigate(['dashboard/departments/new']);
  }

  edit(department: DepartmentResponse): void {
    this.router.navigate(['dashboard/departments', department.id, 'edit']);
  }

  delete(department: DepartmentResponse): void {
    if (!confirm(`Delete ${department.name}?`)) {
      return;
    }

    this.departmentApi.delete(department.id).subscribe({
      next: () => this.load()
    });
  }
}
