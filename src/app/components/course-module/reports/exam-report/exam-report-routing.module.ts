import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CourseWiseComponent } from './course-wise/course-wise.component';
import { ExamWiseComponent } from './exam-wise/exam-wise.component';
import { TeacherPerformanceComponent } from './teacher-performance/teacher-performance.component';
import { ExamReportHomeComponent } from './exam-report-home/exam-report-home.component';
import { ExamReportComponent } from './exam-report.component';


@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: ExamReportComponent,
      pathMatch: 'prefix',
      children: [
          {
              path: '',
              component: ExamReportHomeComponent
          },
          {
              path: 'home',
              component: ExamReportHomeComponent
          },
          {
              path: 'exam',
              component: ExamReportHomeComponent
          },
          {
              path: 'courseWise/:id',
              component: CourseWiseComponent,
              pathMatch: 'prefix'
          },
          {
              path: 'examWise/:id',
              component: ExamWiseComponent,
              pathMatch: 'prefix'
          },
          {
              path: 'teacherWise/:id',
              component: TeacherPerformanceComponent,
              pathMatch: 'prefix'
          },
      ]
    }
  ]
)],
  exports: [RouterModule]
})
export class ExamReportRoutingModule { }
