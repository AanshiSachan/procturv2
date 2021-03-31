import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseModuleComponent } from './course-module.component';
import { CourseHomeComponent } from './course-home/course-home.component';
import { TimeTableComponent } from './time-table/time-table.component';
// import { MasterTagComponent } from './master-tag/master-tag.component';
import { EcourseMappingComponent } from './ecourse-mapping/ecourse-mapping.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import {AttendanceComponent} from './attendance/attendance.component';

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
          loadChildren: () => import('../../components/course-module/create-course/create-course.module').then(m => m.CreateCourseModule),
          //   loadChildren: 'app/components/course-module/create-course/create-course.module#CreateCourseModule',
          // canLoad: [AuthGuard]
        },
        {
          path: 'create-section',
          loadChildren: () => import('../../components/course-module/create-course/create-course.module').then(m => m.CreateCourseModule),
          //   loadChildren: 'app/components/course-module/create-course/create-course.module#CreateCourseModule',
          // canLoad: [AuthGuard]
        },
        {
          path: 'reports',
          loadChildren: () => import('../../components/course-module/reports/reports.module').then(m => m.ReportsModule),
          //   loadChildren: 'app/components/course-module/reports/reports.module#ReportsModule',
          pathMatch: 'prefix',
        },
        {
          path: 'timeTable',
          component: TimeTableComponent
        },
        {
          path: 'setup',
          loadChildren: () => import('../../components/course-module/data-setup/data-setup.module').then(m => m.DataSetupModule),
          //   loadChildren: 'app/components/course-module/data-setup/data-setup.module#DataSetupModule',
          pathMatch: 'prefix',
        },
        {
          path: 'exam-setup',
          loadChildren: () => import('../../components/course-module/data-setup/data-setup.module').then(m => m.DataSetupModule),
          //   loadChildren: 'app/components/course-module/data-setup/data-setup.module#DataSetupModule',
          pathMatch: 'prefix',
        },
        {
          path: 'coursePlanner',
          loadChildren: () => import('../../components/course-module/course-planner/course-planner.module').then(m => m.CoursePlannerModule),
          //   loadChildren: 'app/components/course-module/course-planner/course-planner.module#CoursePlannerModule',
          pathMatch: 'prefix',
        },
        {
          path: 'file-manager',
          loadChildren: () => import('../../components/course-module/file-manager/file-manager.module').then(m => m.FileManagerModule),
          //   loadChildren: 'app/components/course-module/file-manager/file-manager.module#FileManagerModule',
          pathMatch: 'prefix',
        },
        {
          path: 'archiving',
          loadChildren: () => import('../../components/course-module/Archiving/archiving.module').then(m => m.ArchivingModule),
          // loadChildren: 'app/components/course-module/Archiving/archiving.module#ArchivingModule',
          pathMatch: 'prefix'
        },
       
        // {
        //     path: 'online-assignment',
        //     loadChildren: 'app/components/course-module/online-assignment/online-assignment.module#OnlineAssignmentModule',
        //     pathMatch: 'prefix',
        // },
        {
          path: 'ecoursemapping',
          component: EcourseMappingComponent,
          pathMatch: 'prefix'
        },
        {
          path: 'ecourse-file-manager',
          loadChildren: () => import('../../components/course-module/ecourse-file-manager/ecourse-file-manager.module').then(m => m.EcourseFileManagerModule),
          // loadChildren: 'app/components/course-module/ecourse-file-manager/ecourse-file-manager.module#EcourseFileManagerModule',
          pathMatch: 'prefix'
        },
        {
          path: 'online-assignment',
          loadChildren: () => import('../../components/course-module/online-assignment/online-assignment.module').then(m => m.OnlineAssignmentModule),
          // loadChildren: 'app/components/course-module/online-assignment/online-assignment.module#OnlineAssignmentModule',
          pathMatch: 'prefix',
        },
        {
          path: 'analytics',
          // component: AnalyticsComponent
          loadChildren: () => import('../../components/course-module/analytics/analytics.module').then(m => m.AnalyticsModule),
          pathMatch: 'prefix',
        },
        {
          path: 'class-attendance',
          component: AttendanceComponent,
          pathMatch: 'prefix'
        },
        {
          path: 'exam-attendance',
          component: AttendanceComponent,
          pathMatch: 'prefix'
        },
        {
          path: 'exam-marks',
          component: AttendanceComponent,
          pathMatch: 'prefix'
        },
        {
          path: 'teacher',
          loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule),
          pathMatch: 'prefix'
          // loadChildren: 'app/components/course-module/data-setup/teacher/teacher.module#TeacherModule',
          // canLoad: [AuthGuard]
      },
      ]
    }
  ]
  )],
  exports: [RouterModule]
})
export class CourseModuleRoutingModule { }
