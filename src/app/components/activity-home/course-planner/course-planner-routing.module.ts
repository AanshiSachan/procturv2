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
            },
            // {
            //     path:'batches',
            //     component:BatchesComponent
            // },
            // {
            //     path:'batchesArchivedReport',
            //     component:BatchesArchivedReportComponent
            // },
            // {
            //     path:'students',
            //     component:StudentsComponent
            // },
            // {
            //     path:'studentsArchivedReport',
            //     component: StudentsArchivedReportComponent
            // },
            // {
            //     path:'courses',
            //     component:CoursesComponent
            // },
            // {
            //     path:'coursesArchivedReport',
            //     component: CoursesArchivedReportComponent
            // }
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
