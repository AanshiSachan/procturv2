import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendanceComponent } from './attendance.component';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { ViewAttendanceComponent } from './view-attendance/view-attendance.component';


const routes: Routes = [
  {
    path: '',
    component: AttendanceComponent,
    pathMatch: 'prefix',
    children: [
      { path: 'view-attendance', component: ViewAttendanceComponent },
      { path: 'mark-attendance', component: MarkAttendanceComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
