import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { LogoComponent } from './logo/logo.component';
import { SkeletonComponent } from './skeleton/skeleton.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { ToastContainerComponent } from './toast/toast.component';

const MATERIAL = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatSelectModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatTooltipModule,
  MatPaginatorModule,
  MatSortModule,
  MatChipsModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatMenuModule,
  MatAutocompleteModule,
  MatDividerModule,
  LayoutModule,
];

const SHARED_COMPONENTS = [
  LogoComponent,
  SkeletonComponent,
  BreadcrumbsComponent,
  ToastContainerComponent,
];

@NgModule({
  declarations: [...SHARED_COMPONENTS],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ...MATERIAL],
  exports: [CommonModule, RouterModule, ReactiveFormsModule, ...MATERIAL, ...SHARED_COMPONENTS]
})
export class SharedModule {}