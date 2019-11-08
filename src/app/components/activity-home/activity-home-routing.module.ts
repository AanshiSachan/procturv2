import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivityHomeComponent } from './activity-home.component';
import { HomeComponent } from './home/home.component';
import { PtmManagementComponent } from './ptm-management/ptm-management.component';
import { ExamdeskCourseAssignmentComponent } from './examdesk-course-assignment/examdesk-course-assignment.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { CoursePlannerComponent } from './course-planner/course-planner.component';
import { RegisteredStudentsComponent } from './registered-students/registered-students.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ActivityHomeComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        redirectTo: 'dashboard'
                    },
                    {
                        path: 'dashboard',
                        component: HomeComponent
                    },
                    {
                        path: 'ptm',
                        component: PtmManagementComponent
                    },
                    {
                        path: 'monitoring-dashboard',
                        loadChildren: 'app/components/activity-home/monitoring-dashboard/monitoring-dashboard.module#MonitoringDashboardModule',
                        pathMatch: 'prefix'
                    },
                    {
                        path: 'archiving',
                        loadChildren: 'app/components/activity-home/archiving/archiving.module#ArchivingModule',
                        pathMatch: 'prefix'
                    },
                    {
                        path: 'file_manager',
                        loadChildren: 'app/components/activity-home/file-manager/file-manager.module#FileManagerModule',
                        pathMatch: "prefix"
                    },
                    {
                        path: 'timeTable',
                        component: TimeTableComponent
                    },
                    {
                        path: 'examcourse',
                        component: ExamdeskCourseAssignmentComponent,
                        pathMatch: 'prefix'
                    },
                    {
                        path: 'coursePlanner',
                        loadChildren: 'app/components/activity-home/course-planner/course-planner.module#CoursePlannerModule',
                        pathMatch: 'prefix'
                    },
                    {
                        path: 'registeredStudents',
                        component: RegisteredStudentsComponent
                    }


                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ActivityHomeRoutingModule {
}
