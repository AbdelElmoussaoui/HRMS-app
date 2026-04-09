import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EmployeeApiService } from '../services/employee-api.service';
import { DepartmentApiService } from '../services/department-api.service';
import {
  EmployeeCreateRequest,
  EmployeeResponse,
  EmployeeUpdateRequest
} from '../models/employee.model';
import { DepartmentResponse } from '../models/department.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    hireDate: ['', Validators.required],
    status: this.fb.nonNullable.control<'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TERMINATED'>('ACTIVE', { validators: [Validators.required] }),
    salary: [0, [Validators.required, Validators.min(0)]],
    departmentId: this.fb.control<number | null>(null),
    userId: this.fb.control<number | null>(null)
  });

  departments: DepartmentResponse[] = [];
  loading = false;
  employeeId?: number;

  constructor(
    private fb: FormBuilder,
    private employeeApi: EmployeeApiService,
    private departmentApi: DepartmentApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id')) || undefined;
    this.loadDepartments();
    if (this.employeeId) {
      this.loadEmployee(this.employeeId);
    }
  }

  private loadDepartments(): void {
    this.departmentApi.getAll().subscribe({
      next: (data) => (this.departments = data)
    });
  }

  private loadEmployee(id: number): void {
    this.loading = true;
    this.employeeApi.getById(id).subscribe({
      next: (employee) => {
        this.form.patchValue({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone || '',
          hireDate: employee.hireDate,
          status: employee.status,
          salary: employee.salary,
          departmentId: employee.departmentId ?? null,
          userId: employee.userId ?? null
        });
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const payload = this.form.getRawValue();

    if (this.employeeId) {
      const request: EmployeeUpdateRequest = {
        firstName: payload.firstName || undefined,
        lastName: payload.lastName || undefined,
        email: payload.email || undefined,
        phone: payload.phone || undefined,
        hireDate: payload.hireDate || undefined,
        status: payload.status || undefined,
        salary: payload.salary,
        departmentId: payload.departmentId ?? undefined,
        userId: payload.userId ?? undefined
      };
      this.employeeApi.update(this.employeeId, request).subscribe({
        next: () => this.navigateBack(),
        error: () => (this.loading = false)
      });
      return;
    }

    const request: EmployeeCreateRequest = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone || undefined,
      hireDate: payload.hireDate,
      status: payload.status,
      salary: payload.salary,
      departmentId: payload.departmentId ?? undefined,
      userId: payload.userId ?? undefined
    };
    this.employeeApi.create(request).subscribe({
      next: () => this.navigateBack(),
      error: () => (this.loading = false)
    });
  }

  cancel(): void {
    this.navigateBack();
  }

  private navigateBack(): void {
    this.loading = false;
    this.router.navigate(['/dashboard/employees']);
  }
}
