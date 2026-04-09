import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DepartmentApiService } from '../services/department-api.service';
import { DepartmentCreateRequest, DepartmentUpdateRequest } from '../models/department.model';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.scss']
})
export class DepartmentFormComponent implements OnInit {
  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['']
  });

  departmentId?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private departmentApi: DepartmentApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.departmentId = Number(this.route.snapshot.paramMap.get('id')) || undefined;
    if (this.departmentId) {
      this.loadDepartment(this.departmentId);
    }
  }

  private loadDepartment(id: number): void {
    this.loading = true;
    this.departmentApi.getById(id).subscribe({
      next: (department) => {
        this.form.patchValue({
          name: department.name,
          description: department.description || ''
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

    if (this.departmentId) {
      const request: DepartmentUpdateRequest = {
        name: payload.name || undefined,
        description: payload.description || undefined
      };
      this.departmentApi.update(this.departmentId, request).subscribe({
        next: () => this.navigateBack(),
        error: () => (this.loading = false)
      });
      return;
    }

    const request: DepartmentCreateRequest = {
        name: payload.name,
        description: payload.description || undefined
      };
    this.departmentApi.create(request).subscribe({
      next: () => this.navigateBack(),
      error: () => (this.loading = false)
    });
  }

  cancel(): void {
    this.navigateBack();
  }

  private navigateBack(): void {
    this.loading = false;
    this.router.navigate(['/dashboard/departments']);
  }
}
