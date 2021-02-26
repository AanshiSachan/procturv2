import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamsModuleRoutingModule } from './exams-module-routing.module';
import { ExamsModuleComponent } from '../exams-module/exams-module.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ExamsModuleComponent, ScheduleComponent],
  imports: [
    CommonModule,
    ExamsModuleRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class ExamsModuleModule { }
