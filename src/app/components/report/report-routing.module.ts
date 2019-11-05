import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportComponent } from './report.component';
import { ReportHomeComponent } from './report-home/report-home.component'
import { AttendanceReportComponent } from './attendance-report/attendanceReport.component';
import { EmailReportComponent } from './email-report/email-report.component';
import { ExamReportComponent } from './exam-report/exam-report.component';
import { FeeReportComponent } from './fee-report/fee-report.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { BiometricComponent } from './biometric/biometric.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ReportComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        component: ReportHomeComponent
                    },
                    {
                        path: 'home',
                        component: ReportHomeComponent
                    },
                    {
                        path: 'attendance',
                        component: AttendanceReportComponent
                    },
                    {
                        path: 'biometric',
                        component: BiometricComponent
                    },
                    {
                        path: 'sms',
                        loadChildren: 'app/components/report/sms-reports/sms-reports.module#SmsReportsModule',
                        pathMatch: 'prefix'
                    },
                    // {
                    //     path: 'fee',
                    //     loadChildren: 'app/components/report/fee-report/fee-report.module#FeeReportModule',
                    //     pathMatch: 'prefix'
                    // },
                    {
                        path: 'exam',
                        component: ExamReportComponent
                    },
                    {
                        path: 'reportCard',
                        loadChildren: 'app/components/report/report-card/report-card.module#ReportCardModule',
                    },
                    {
                        path: 'email',
                        component: EmailReportComponent
                    },
                    {
                        path: 'profitNloss',
                        component: ProfitLossComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ReportRoutingModule {
}
