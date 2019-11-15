import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivityHomeComponent } from './activity-home.component';
import { HomeComponent } from './home/home.component';
import { ExamdeskCourseAssignmentComponent } from './examdesk-course-assignment/examdesk-course-assignment.component';


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
                        path: 'monitoring-dashboard',
                        loadChildren: 'app/components/activity-home/monitoring-dashboard/monitoring-dashboard.module#MonitoringDashboardModule',
                        pathMatch: 'prefix'
                    },
                    // {
                    //     path: 'archiving',
                    //     loadChildren: 'app/components/activity-home/archiving/archiving.module#ArchivingModule',
                    //     pathMatch: 'prefix'
                    // },
                    // {
                    //     path: 'file_manager',
                    //     loadChildren: 'app/components/activity-home/file-manager/file-manager.module#FileManagerModule',
                    //     pathMatch: "prefix"
                    // },
                    {
                        path: 'examcourse',
                        component: ExamdeskCourseAssignmentComponent,
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
export class ActivityHomeRoutingModule {
}
