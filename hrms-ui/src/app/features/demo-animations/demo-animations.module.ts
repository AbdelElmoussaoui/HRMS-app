import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { DemoAnimationsComponent } from './demo-animations.component';

const routes: Routes = [
  { path: '', component: DemoAnimationsComponent }
];

@NgModule({
  declarations: [DemoAnimationsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class DemoAnimationsModule {}