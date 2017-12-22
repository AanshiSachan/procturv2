import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportComponent } from './report.component';
import { ReportHomeComponent } from './report-home/report-home.component'
import { SmsReportComponent } from './sms-report/sms-report.component'
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
import { EmailReportComponent } from './email-report/email-report.component';
import { ExamReportComponent } from './exam-report/exam-report.component';
import { FeeReportComponent } from './fee-report/fee-report.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { ReportCardComponent } from './report-card/report-card.component';
import { TimeTableComponent } from './time-table/time-table.component';

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
                        path: 'sms',
                        component: SmsReportComponent
                    },
                    {
                        path: 'fee',
                        component: FeeReportComponent 
                    },
                    {
                        path: 'exam',
                        component: ExamReportComponent
                    },
                    {
                        path: 'reportCard',
                        component: ReportCardComponent
                    },
                    {
                        path: 'timeTable',
                        component: TimeTableComponent
                    },
                    {
                        path: 'email',
                        component: EmailReportComponent
                    },
                    {
                        path: 'profitNloss',
                        component: ProfitLossComponent
                    },
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