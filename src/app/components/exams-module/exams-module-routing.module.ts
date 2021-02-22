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
          }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamsModuleRoutingModule { }
