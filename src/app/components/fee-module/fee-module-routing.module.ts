import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FeeReportHomeComponent } from './fee-report-home/fee-report-home.component'
import { FeeCourseReportComponent } from './fee-course-report/fee-course-report.component';
import { AllDataReportComponent } from './all-data-report/all-data-report.component';
import { InactiveStudentReportComponent } from './inactive-student-report/inactive-student-report.component';
import { GstReportComponent } from './gst-report/gst-report.component';
import { OnlinePaymentHistoryComponent } from './online-payment-history/online-payment-history.component';
import {PaymentHistoryMainComponent} from './payment-history-main/payment-history-main.component';
import { ChequeManageComponent } from './cheque-manage/cheque-manage.component';
import { FeeComponent } from './fee-module.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: FeeComponent,
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
                        path: 'moduleReport',
                        component: FeeCourseReportComponent
                    },
                    {
                        path: 'allDueReport',
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
                    },
                    {
                        path: 'cheque',
                        component : ChequeManageComponent
                    },
                    {
                        path:'paymentHistory',
                        component : PaymentHistoryMainComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class FeeRoutingModule {
}