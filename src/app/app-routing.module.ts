import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: '/authPage', pathMatch: 'full' },
            { path: 'authPage', loadChildren: 'app/components/auth-page/auth-page.module#AuthPageModule' },
            { path: 'course', loadChildren: 'app/components/course/course.module#CourseModule' },
            { path: 'enquiry', loadChildren: 'app/components/enquiry/enquiry.module#EnquiryModule' },
            { path: 'student', loadChildren: 'app/components/students/student.module#StudentModule' },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}