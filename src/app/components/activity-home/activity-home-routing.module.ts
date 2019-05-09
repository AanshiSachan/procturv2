import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivityHomeComponent } from './activity-home.component';
import { HomeComponent } from './home/home.component';
import { PtmManagementComponent } from './ptm-management/ptm-management.component';
import { ExamdeskCourseAssignmentComponent } from './examdesk-course-assignment/examdesk-course-assignment.component';
import { LiveClassesComponent } from './live-classes/live-classes.component';
import { EcourseMappingComponent } from './ecourse-mapping/ecourse-mapping.component';
import { AddClassComponent } from './live-classes/add-class/add-class.component';
import { EditClassComponent } from './live-classes/edit-class/edit-class.component';



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
                        path: 'manage',
                        loadChildren: 'app/components/activity-home/fee-activity/fee-activity.module#FeeActivityModule',
                        pathMatch: 'prefix'
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
                        path: 'examcourse',
                        component: ExamdeskCourseAssignmentComponent,
                        pathMatch: 'prefix'
                    },
                    {
                        path: 'liveClass',
                        component: LiveClassesComponent,
                        pathMatch: 'prefix'
                    },
                    {
                        path: 'ecoursemapping',
                        component: EcourseMappingComponent,
                        pathMatch: 'prefix'
                    },
                    {
                        path: 'add',
                        component: AddClassComponent
                    },
                    {
                        path: 'edit/:id',
                        component: EditClassComponent
                    },
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
