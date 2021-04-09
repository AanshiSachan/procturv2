import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeeComponent, FeeReportHomeComponent, FeeCourseReportComponent, AllDataReportComponent, InactiveStudentReportComponent,
     GstReportComponent, OnlinePaymentHistoryComponent, PaymentHistoryMainComponent ,ChequeManageComponent} from '.';
import { FeeAssignmentComponent } from './fee-assignment/fee-assignment.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';


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
                        loadChildren: () => import('app/components/fee-module/data-setup/data-setup.module').then(m => m.DataSetupModule)
                        // loadChildren:'app/components/fee-module/data-setup/data-setup.module#DataSetupModule',
                    },
                    {
                        path: 'monitoring-dashboard',
                        loadChildren: () => import('app/components/fee-module/monitoring-dashboard/monitoring-dashboard.module').then(m => m.MonitoringDashboardModule),
                        // loadChildren: 'app/components/fee-module/monitoring-dashboard/monitoring-dashboard.module#MonitoringDashboardModule',
                        pathMatch: 'prefix'
                    },
                    {
                        path: 'profitNloss',
                        component: ProfitLossComponent,
                        pathMatch: 'prefix'
                    },{
                        path:'assign-fee',
                        component : FeeAssignmentComponent
                    },
                    {
                        path:'update-fee',
                        loadChildren: () => import('app/components/fee-module/fee-update/fee-update.module').then(m => m.FeeUpdateModule),
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