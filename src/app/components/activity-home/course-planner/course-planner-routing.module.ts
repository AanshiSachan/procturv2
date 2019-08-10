import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursePlannerComponent } from './course-planner.component';
import { ClassComponent } from './class/class.component';
import { ExamComponent } from './exam/exam.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
        path: '',
        component: CoursePlannerComponent,
        pathMatch: 'prefix',
        children: [
            {
                path: '',
                component: ClassComponent,
                pathMatch: 'prefix'
            },
            {
                path: 'home',
                component: ClassComponent,
                pathMatch: 'prefix'
            }
        ]
      }
    ])
  ],
  exports: [
      RouterModule
  ]
})
export class CoursePlannerRoutingModule {

}
