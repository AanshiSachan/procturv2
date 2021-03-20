import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarksComponent } from './marks.component';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { MarksUpdateComponent } from './marks-update/marks-update.component';

const routes: Routes = [
  {
    path: '',
    component: MarksComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: 'schedule-list',
        component: ScheduleListComponent
      },
      {
        path: 'update-marks/:batch_exam_schedule_id',
        component: MarksUpdateComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarksRoutingModule { }
