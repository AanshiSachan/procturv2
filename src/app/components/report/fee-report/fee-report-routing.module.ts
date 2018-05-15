import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeeReportComponent } from './fee-report.component';
import {FeeReportHomeComponent} from './fee-report-home/fee-report-home.component'
import { FeeCourseReportComponent } from './fee-course-report/fee-course-report.component';
import {AllDataReportComponent} from './all-data-report/all-data-report.component';
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
                        component:FeeReportHomeComponent
                    },
                    {
                        path: 'home',
                        component: FeeReportHomeComponent
                    },
                    {
                        path:'courseReport',
                        component: FeeCourseReportComponent
                    },
                    {
                        path:'allData',
                        component: AllDataReportComponent
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