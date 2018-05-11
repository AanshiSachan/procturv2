import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeeReportComponent } from './fee-report.component';
import { FeeCourseReportComponent } from './fee-course-report/fee-course-report.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: FeeReportComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        redirectTo: 'home'
                    },
                    {
                        path: 'home',
                        component: FeeCourseReportComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class FeeReportRoutingModule {
}