import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: '/enquiry', pathMatch: 'full' },
            { path: 'enquiry', loadChildren: 'app/components/enquiry/enquiry.module#EnquiryModule' },
            { path: 'student', loadChildren: 'app/components/students/student.module#StudentModule' }
            /* {
                path: '**',
                component: CustomErrorPageComponent,
                pathMatch: 'full'
            } */
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}