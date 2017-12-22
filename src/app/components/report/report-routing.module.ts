import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportComponent } from './report.component';
import { ReportHomeComponent } from './report-home/report-home.component'
import { SmsReportComponent } from './sms-report/sms-report.component'


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
                        path: 'sms',
                        component: SmsReportComponent 
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