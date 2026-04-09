import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing.module';
import { ShellModule } from './shell/shell.module';

@NgModule({
  imports: [CommonModule, FeaturesRoutingModule, ShellModule]
})
export class FeaturesModule {}
