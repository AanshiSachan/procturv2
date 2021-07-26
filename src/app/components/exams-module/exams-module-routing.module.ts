import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamsModuleComponent } from './exams-module.component';
import {ScheduleComponent} from '../exams-module/schedule/schedule.component';

const routes: Routes = [
  {
      path: '',
      component: ExamsModuleComponent,
      pathMatch: 'prefix',
      children: [
          {
            path: 'home',
            component: ExamsModuleComponent,
          },
          {
            path: 'schedule',
            component: ScheduleComponent
          },
          {
            path: 'marks',
            loadChildren: () => import('./marks/marks.module').then(m => m.MarksModule),
            pathMatch: 'prefix'
          },
          {
            path: 'reports',
            loadChildren: () => import('./exam-reports/exam-reports.module').then(m => m.ExamReportsModule),
            pathMatch: 'prefix'
          }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamsModuleRoutingModule { }
