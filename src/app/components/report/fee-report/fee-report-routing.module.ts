import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeeReportComponent } from './fee-report.component';
import { FeeReportHomeComponent } from './fee-report-home/fee-report-home.component'
import { FeeCourseReportComponent } from './fee-course-report/fee-course-report.component';
import { AllDataReportComponent } from './all-data-report/all-data-report.component';
import { InactiveStudentReportComponent } from './inactive-student-report/inactive-student-report.component';
import { GstReportComponent } from './gst-report/gst-report.component';
import { OnlinePaymentHistoryComponent } from './online-payment-history/online-payment-history.component';
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
                        component: FeeReportHomeComponent
                    },
                    {
                        path: 'home',
                        component: FeeReportHomeComponent
                    },
                    {
                        path: 'courseReport',
                        component: FeeCourseReportComponent
                    },
                    {
                        path: 'allData',
                        component: AllDataReportComponent
                    },
                    {
                        path: 'inactive',
                        component: InactiveStudentReportComponent
                    },
                    {
                        path: 'gst',
                        component: GstReportComponent
                    },
                    {
                        path: 'onlinePayment',
                        component: OnlinePaymentHistoryComponent
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