import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent, pathMatch: 'full'},
            { path: 'enquiry', loadChildren: 'app/components/enquiry/enquiry.module#EnquiryModule' },
            { path: 'student', loadChildren: 'app/components/students/student.module#StudentModule' },
            { path: 'common', loadChildren: 'app/components/custom/custom.module#CustomModule' },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}