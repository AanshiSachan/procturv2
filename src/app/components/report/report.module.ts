import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { ReportRoutingModule } from './report-routing.module';

/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import 'moment';
import 'hammerjs';

import { MultiselectDropdownModule } from '../../../assets/imported_modules/multiselect-dropdown';
import { BusyModule, BusyConfig } from '../../../assets/imported_modules/angular2-busy/build';
import { NgLoggerModule, Level } from '@nsalaun/ng-logger';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { TimepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/timepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { ReportHomeComponent } from './report-home/report-home.component';
import { SmsReportComponent } from './sms-report/sms-report.component';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
import { FeeReportComponent } from './fee-report/fee-report.component';
import { ExamReportComponent } from './exam-report/exam-report.component';
import { ReportCardComponent } from './report-card/report-card.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { EmailReportComponent } from './email-report/email-report.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { getSMSService } from '../../services/report-services/get-sms.service';
import { postSMSService } from '../../services/report-services/post-sms.service';
import { SharedModule } from '../shared/shared.module';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MultiselectDropdownModule,
        BusyModule,
        NgLoggerModule.forRoot(Level.LOG),
        CommonModule,
        ReportRoutingModule,
        BsDatepickerModule,
        TimepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule,
        SharedModule
    ],
    declarations: [
        ReportComponent,
        ReportHomeComponent,
        SmsReportComponent,
        AttendanceReportComponent,
        FeeReportComponent,
        ExamReportComponent,
        ReportCardComponent,
        TimeTableComponent,
        EmailReportComponent,
        ProfitLossComponent
    ],
    entryComponents: [
    ],
    providers: [
        getSMSService,
        postSMSService
    ]
})
export class ReportModule {

}