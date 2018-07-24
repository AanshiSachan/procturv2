import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { ReportRoutingModule } from './report-routing.module';

/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import 'moment';
import 'hammerjs';

import { FilterPipe } from './exam-report/filter.pipe';


import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';

import { ReportHomeComponent } from './report-home/report-home.component';
import { SmsReportComponent } from './sms-report/sms-report.component';
import { AttendanceReportComponent } from './attendance-report/attendanceReport.component';

import { ExamReportComponent } from './exam-report/exam-report.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { tableComponent } from './time-table/table/table.component';
import { EmailReportComponent } from './email-report/email-report.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';

import { getSMSService } from '../../services/report-services/get-sms.service';
import { getEmailService } from '../../services/report-services/get-email.service';
import { ExamService } from '../../services/report-services/exam.service';
import { postSMSService } from '../../services/report-services/post-sms.service';
import { timeTableService } from '../../services/TimeTable/timeTable.service';
import { SharedModule } from '../shared/shared.module';
import { postEmailService } from '../../services/report-services/post-email.service';

import { searchPipe } from '../shared/pipes/searchBarPipe';
import { arraySortPipe } from '../shared/pipes/sortBarPipe';
import { AttendanceReportServiceService } from '../../services/attendance-report/attendance-report-service.service';
import { BiometricComponent } from './biometric/biometric.component';
import { BiometricServiceService } from '../../services/biometric-service/biometric-service.service';
import { ReportWidgetComponent } from './report-widget/report-widget.component';
import { ProfitLossServiceService } from '../../services/profit-loss-service/profit-loss-service.service';
import { EnquiryReportComponent } from './enquiry-report/enquiry-report.component';
import { EnquiryReportModule } from './enquiry-report/enquiry-report.module';
import { EnquiryReportRoutingModule } from './enquiry-report/enquiry-report-routing.module';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap';
import { TimepickerModule } from '../../../assets/imported_modules/ngx-bootstrap';
import { ExcelService } from '../../services/excel.service';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        ReportRoutingModule,
        BsDatepickerModule,
        TimepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule,
        SharedModule,
        EnquiryReportModule
    ],
    declarations: [
        ReportComponent,
        ReportHomeComponent,
        SmsReportComponent,
        AttendanceReportComponent, FilterPipe,
        ExamReportComponent,
        TimeTableComponent,
        tableComponent,
        EmailReportComponent,
        ProfitLossComponent,
        searchPipe,
        arraySortPipe,
        BiometricComponent,
        ReportWidgetComponent
    ],
    entryComponents: [
        tableComponent,
    ],
    providers: [
        getSMSService,
        postSMSService, ExamService,
        AttendanceReportServiceService,
        getEmailService,
        postEmailService, timeTableService,
        BiometricServiceService,
        ProfitLossServiceService,
        ExcelService
    ],
    exports: [
        FilterPipe
    ]
})
export class ReportModule {

}
