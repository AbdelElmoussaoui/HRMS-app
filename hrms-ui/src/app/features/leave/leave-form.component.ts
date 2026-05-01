import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LeaveRequestApiService } from '../services/leave-request-api.service';
import { EmployeeApiService } from '../services/employee-api.service';
import { EmployeeResponse } from '../models/employee.model';
import {
  LeaveRequestCreateRequest,
  LeaveRequestUpdateRequest
} from '../models/leave-request.model';

@Component({
  selector: 'app-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.scss']
})
export class LeaveFormComponent implements OnInit {
  form = this.fb.nonNullable.group({
    employeeId: this.fb.control<number | null>(null, { validators: [Validators.required] }),
    type:       this.fb.nonNullable.control<'ANNUAL' | 'SICK' | 'UNPAID'>('ANNUAL', { validators: [Validators.required] }),
    startDate:  ['', Validators.required],
    endDate:    ['', Validators.required],
    reason:     ['', Validators.required]
  });

  employeeSearchControl = new FormControl<EmployeeResponse | string>('');
  employees:         EmployeeResponse[] = [];
  filteredEmployees: EmployeeResponse[] = [];

  requestId?: number;
  loading = false;

  constructor(
    private fb:        FormBuilder,
    private leaveApi:  LeaveRequestApiService,
    private employeeApi: EmployeeApiService,
    private route:     ActivatedRoute,
    private router:    Router
  ) {}

  ngOnInit(): void {
    this.requestId = Number(this.route.snapshot.paramMap.get('id')) || undefined;
    this.loadEmployees();
    if (this.requestId) {
      this.loadRequest(this.requestId);
    }

    this.employeeSearchControl.valueChanges.subscribe(val => {
      const term = typeof val === 'string' ? val.toLowerCase() : '';
      this.filteredEmployees = this.employees.filter(e =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(term)
      );
    });
  }

  private loadEmployees(): void {
    this.employeeApi.getAll().subscribe({
      next: (emps) => {
        this.employees         = emps;
        this.filteredEmployees = emps;

        if (this.requestId) {
          const id  = this.form.getRawValue().employeeId;
          const emp = emps.find(e => e.id === id);
          if (emp) { this.employeeSearchControl.setValue(emp); }
        }
      }
    });
  }

  private loadRequest(id: number): void {
    this.loading = true;
    this.leaveApi.getById(id).subscribe({
      next: (r) => {
        this.form.patchValue({
          employeeId: r.employeeId,
          type:       r.type,
          startDate:  r.startDate,
          endDate:    r.endDate,
          reason:     r.reason
        });
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  displayEmployee(value: EmployeeResponse | string | null): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return `${value.firstName} ${value.lastName}`;
  }

  onEmployeeSelected(emp: EmployeeResponse): void {
    this.form.patchValue({ employeeId: emp.id });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const payload = this.form.getRawValue();

    if (this.requestId) {
      const req: LeaveRequestUpdateRequest = {
        type:      payload.type || undefined,
        startDate: payload.startDate || undefined,
        endDate:   payload.endDate || undefined,
        reason:    payload.reason || undefined
      };
      this.leaveApi.update(this.requestId, req).subscribe({
        next:  () => this.navigateBack(),
        error: () => (this.loading = false)
      });
      return;
    }

    const req: LeaveRequestCreateRequest = {
      employeeId: payload.employeeId as number,
      type:       payload.type,
      startDate:  payload.startDate,
      endDate:    payload.endDate,
      reason:     payload.reason
    };
    this.leaveApi.create(req).subscribe({
      next:  () => this.navigateBack(),
      error: () => (this.loading = false)
    });
  }

  cancel(): void { this.navigateBack(); }

  private navigateBack(): void {
    this.loading = false;
    this.router.navigate(['/dashboard/leave']);
  }
}