import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeeReportComponent } from './fee-report.component';
import {FeeReportHomeComponent} from './fee-report-home/fee-report-home.component'
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
                    },
                    {
                        path:'feeHome',
                        component:FeeReportHomeComponent
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