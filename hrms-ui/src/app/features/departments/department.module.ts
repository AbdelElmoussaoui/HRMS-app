import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { DepartmentListComponent } from './department-list.component';
import { DepartmentFormComponent } from './department-form.component';

const routes: Routes = [
  {
    path: '',
    component: DepartmentListComponent
  },
  {
    path: 'new',
    component: DepartmentFormComponent
  },
  {
    path: ':id/edit',
    component: DepartmentFormComponent
  }
];

@NgModule({
  declarations: [DepartmentListComponent, DepartmentFormComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, RouterModule.forChild(routes)]
})
export class DepartmentModule {}
