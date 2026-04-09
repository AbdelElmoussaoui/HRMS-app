import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { LeaveListComponent } from './leave-list.component';
import { LeaveFormComponent } from './leave-form.component';
import { ManagerApprovalComponent } from './manager-approval.component';

const routes: Routes = [
  {
    path: '',
    component: LeaveListComponent
  },
  {
    path: 'new',
    component: LeaveFormComponent
  },
  {
    path: ':id/edit',
    component: LeaveFormComponent
  },
  {
    path: 'approvals',
    component: ManagerApprovalComponent
  }
];

@NgModule({
  declarations: [LeaveListComponent, LeaveFormComponent, ManagerApprovalComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, RouterModule.forChild(routes)]
})
export class LeaveModule {}
