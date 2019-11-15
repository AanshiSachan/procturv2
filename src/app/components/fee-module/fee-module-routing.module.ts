import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeeComponent, FeeReportHomeComponent, FeeCourseReportComponent, AllDataReportComponent, InactiveStudentReportComponent,
     GstReportComponent, OnlinePaymentHistoryComponent, PaymentHistoryMainComponent ,ChequeManageComponent} from '.';


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
                    },
                    {
                        path:'data-setup',
                        loadChildren:'app/components/fee-module/data-setup/data-setup.module#DataSetupModule',
                    },
                    {
                        path: 'monitoring-dashboard',
                        loadChildren: 'app/components/fee-module/monitoring-dashboard/monitoring-dashboard.module#MonitoringDashboardModule',
                        pathMatch: 'prefix'
                    },
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