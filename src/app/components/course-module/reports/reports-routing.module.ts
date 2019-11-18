import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ReportHomeComponent } from './report-home/report-home.component';
import { AttendanceReportComponent } from './attendance-report/attendanceReport.component';
import { ExamReportMainComponent } from './exam-report-main/exam-report.component';


const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
      {
          path: '',
          component: ReportsComponent,
          pathMatch: 'prefix',
          children: [
              {
                  path: '',
                  component: ReportHomeComponent,
              },
              {
                  path: 'home',
                  component: ReportHomeComponent,
                  pathMatch: 'prefix',
              },
              {
                  path: 'attendance',
                  component: AttendanceReportComponent
              },
              {
                path: 'exam',
                  component:ExamReportMainComponent
              }
            //   {
            //       path: 'exam',
            //       loadChildren: 'app/components/course-module/reports/exam-report/exam-report.module#ExamReportModule',
            //       pathMatch: 'prefix'
            //   },
          ]
      }
  ]
)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
