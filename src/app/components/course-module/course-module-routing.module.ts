import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseModuleComponent } from './course-module.component';
import { CourseHomeComponent } from './course-home/course-home.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { MasterTagComponent } from './master-tag/master-tag.component';
import { EcourseMappingComponent } from './ecourse-mapping/ecourse-mapping.component';

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
                  loadChildren: () => import('app/components/course-module/create-course/create-course.module').then(m => m.CreateCourseModule),
                //   loadChildren: 'app/components/course-module/create-course/create-course.module#CreateCourseModule',
                  // canLoad: [AuthGuard]
              },
              {
                  path: 'reports',
                  loadChildren: () => import('app/components/course-module/reports/reports.module').then(m => m.ReportsModule),
                //   loadChildren: 'app/components/course-module/reports/reports.module#ReportsModule',
                  pathMatch: 'prefix',
              },
              {
                  path: 'timeTable',
                  component: TimeTableComponent
              },
              {
                  path: 'setup',
                  loadChildren: () => import('app/components/course-module/data-setup/data-setup.module').then(m => m.DataSetupModule),
                //   loadChildren: 'app/components/course-module/data-setup/data-setup.module#DataSetupModule',
                  pathMatch: 'prefix',
              },
              {
                  path: 'coursePlanner',
                  loadChildren: () => import('app/components/course-module/course-planner/course-planner.module').then(m => m.CoursePlannerModule),
                //   loadChildren: 'app/components/course-module/course-planner/course-planner.module#CoursePlannerModule',
                  pathMatch: 'prefix',
              },
              {
                  path:'file-manager',
                  loadChildren: () => import('app/components/course-module/file-manager/file-manager.module').then(m => m.FileManagerModule),
                //   loadChildren: 'app/components/course-module/file-manager/file-manager.module#FileManagerModule',
                  pathMatch: 'prefix',
              },
              {
                path: 'archiving',
                loadChildren: () => import('app/components/course-module/Archiving/archiving.module').then(m => m.ArchivingModule),
                // loadChildren: 'app/components/course-module/Archiving/archiving.module#ArchivingModule',
                pathMatch: 'prefix'
            },
            {
                path: 'master-tag',
                component: MasterTagComponent
            },
            {
                path: 'ecoursemapping',
                component: EcourseMappingComponent,
                pathMatch: 'prefix'
            },
            {
                path: 'ecourse-file-manager',
                loadChildren: () => import('app/components/course-module/ecourse-file-manager/ecourse-file-manager.module').then(m => m.EcourseFileManagerModule),
                // loadChildren: 'app/components/course-module/ecourse-file-manager/ecourse-file-manager.module#EcourseFileManagerModule',
                pathMatch: 'prefix'
            },
            {
                path: 'online-assignment',
                loadChildren: () => import('app/components/course-module/online-assignment/online-assignment.module').then(m => m.OnlineAssignmentModule),
                // loadChildren: 'app/components/course-module/online-assignment/online-assignment.module#OnlineAssignmentModule',
                pathMatch: 'prefix',
            }
          ]
      }
  ]
)],
  exports: [RouterModule]
})
export class CourseModuleRoutingModule { }
