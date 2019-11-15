import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseModuleComponent } from './course-module.component';
import { CourseHomeComponent } from './course-home/course-home.component';
import { TimeTableComponent } from './time-table/time-table.component';


@NgModule({
  imports: [RouterModule.forChild([
      {
          path: '',
          component: CourseModuleComponent,
          pathMatch: 'prefix',
          children: [
              {
                  path: '',
                  component: CourseHomeComponent,
              },
              {
                  path: 'home',
                  component: CourseHomeComponent,
                  pathMatch: 'prefix',
              },
              {
                  path: 'create',
                  loadChildren: 'app/components/course-module/create-course/create-course.module#CreateCourseModule',
                  // canLoad: [AuthGuard]
              },
              {
                  path: 'reports',
                  loadChildren: 'app/components/course-module/reports/reports.module#ReportsModule',
                  pathMatch: 'prefix',
              },
              {
                  path: 'timeTable',
                  component: TimeTableComponent
              },
              {
                  path: 'setup',
                  loadChildren: 'app/components/course-module/data-setup/data-setup.module#DataSetupModule',
                  pathMatch: 'prefix',
              },
              {
                  path: 'coursePlanner',
                  loadChildren: 'app/components/course-module/course-planner/course-planner.module#CoursePlannerModule',
                  pathMatch: 'prefix',
              },
              {
                  path: 'coursePlanner',
                  loadChildren: 'app/components/course-module/course-planner/course-planner.module#CoursePlannerModule',
                  pathMatch: 'prefix',
              },
              {
                  path:'file-manager',
                  loadChildren: 'app/components/course-module/file-manager/file-manager.module#FileManagerModule',
                  pathMatch: 'prefix',
              },
              {
                path: 'archiving',
                loadChildren: 'app/components/course-module/Archiving/archiving.module#ArchivingModule',
                pathMatch: 'prefix'
            },
          ]
      }
  ]
)],
  exports: [RouterModule]
})
export class CourseModuleRoutingModule { }
