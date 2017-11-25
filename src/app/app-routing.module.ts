import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules} from '@angular/router';
/* import { CanDeactivateGuard }      from './guards/can-deactivate-guard.service'; */
import { AuthGuard } from './guards/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: 'authPage',
                    loadChildren: 'app/components/auth-page/auth-page.module#AuthPageModule'

                },
                {
                    path: 'course',
                    loadChildren: 'app/components/course/course.module#CourseModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'enquiry',
                    loadChildren: 'app/components/enquiry/enquiry.module#EnquiryModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'student',
                    loadChildren: 'app/components/students/student.module#StudentModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'custom',
                    loadChildren: 'app/components/custom-common/custom-common.module#CustomCommonModule',
                    canLoad: [AuthGuard]
                },
                { path: '', redirectTo: '/authPage', pathMatch: 'full', },
                /* { path: '**', component: PageNotFoundComponent } */
            ],
            { 
                useHash: true,
                preloadingStrategy: PreloadAllModules
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