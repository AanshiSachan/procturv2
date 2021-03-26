import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from '../attendance/attendance.component';
import { ViewAttendanceComponent } from './view-attendance/view-attendance.component';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [AttendanceComponent, ViewAttendanceComponent, MarkAttendanceComponent],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class AttendanceModule { }
