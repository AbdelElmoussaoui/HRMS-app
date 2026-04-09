import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LeaveRequestApiService } from '../services/leave-request-api.service';
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
    type: this.fb.nonNullable.control<'ANNUAL' | 'SICK' | 'UNPAID'>('ANNUAL', { validators: [Validators.required] }),
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    reason: ['', Validators.required]
  });

  requestId?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private leaveApi: LeaveRequestApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.requestId = Number(this.route.snapshot.paramMap.get('id')) || undefined;
    if (this.requestId) {
      this.load(this.requestId);
    }
  }

  private load(id: number): void {
    this.loading = true;
    this.leaveApi.getById(id).subscribe({
      next: (request) => {
        this.form.patchValue({
          employeeId: request.employeeId,
          type: request.type,
          startDate: request.startDate,
          endDate: request.endDate,
          reason: request.reason
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

    if (this.requestId) {
      const request: LeaveRequestUpdateRequest = {
        type: payload.type || undefined,
        startDate: payload.startDate || undefined,
        endDate: payload.endDate || undefined,
        reason: payload.reason || undefined
      };
      this.leaveApi.update(this.requestId, request).subscribe({
        next: () => this.navigateBack(),
        error: () => (this.loading = false)
      });
      return;
    }

    const request: LeaveRequestCreateRequest = {
      employeeId: payload.employeeId as number,
      type: payload.type,
      startDate: payload.startDate,
      endDate: payload.endDate,
      reason: payload.reason
    };
    this.leaveApi.create(request).subscribe({
      next: () => this.navigateBack(),
      error: () => (this.loading = false)
    });
  }

  cancel(): void {
    this.navigateBack();
  }

  private navigateBack(): void {
    this.loading = false;
    this.router.navigate(['/dashboard/leave']);
  }
}
