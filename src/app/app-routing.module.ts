import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules} from '@angular/router';
/* import { CanDeactivateGuard }      from './guards/can-deactivate-guard.service'; */
import { AuthGuard } from './guards/auth.guard';
import { ErrorComponent } from './components/error/error.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                { path: '', redirectTo: '/authPage', pathMatch: 'full', },
                /* { path: 'dashboard', component: }, */
                {
                    path: 'authPage',
                    loadChildren: 'app/components/auth-page/auth-page.module#AuthPageModule'

                },
                {
                    path: 'enquiry',
                    loadChildren: 'app/components/enquiry/enquiry.module#EnquiryModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'custom',
                    loadChildren: 'app/components/custom-common/custom-common.module#CustomCommonModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'student',
                    loadChildren: 'app/components/students/student.module#StudentModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'campaign',
                    loadChildren: 'app/components/campaign/campaign.module#CampaignModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'reports',
                    loadChildren: 'app/components/report/report.module#ReportModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'course',
                    loadChildren: 'app/components/course/course.module#CourseModule',
                    canLoad: [AuthGuard]
                },
                { path: 'comingsoon', component: ComingSoonComponent },
                { path: '**', component: ErrorComponent },
            ],
            { 
                useHash: true,
                /* preloadingStrategy: PreloadAllModules */
             }
        )
    ],
    exports: [
        RouterModule
    ],
    providers: [
        /* CanDeactivateGuard */
    ]
})
export class AppRoutingModule {
}