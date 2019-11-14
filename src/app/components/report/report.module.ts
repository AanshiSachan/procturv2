import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report.component';
import { ReportRoutingModule } from './report-routing.module';

/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import 'moment';
import 'hammerjs';

import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { ReportHomeComponent } from './report-home/report-home.component';
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
import { BsDatepickerModule } from 'ngx-bootstrap-custome';
import { TimepickerModule } from 'ngx-bootstrap-custome';
import { ExcelService } from '../../services/excel.service';
import { ExportToPdfService } from '../../services/export-to-pdf.service';

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
        SharedModule
    ],
    declarations: [
        ReportComponent,
        ReportHomeComponent,
        ProfitLossComponent,
        searchPipe,
        arraySortPipe,
        BiometricComponent,
        ReportWidgetComponent
    ],
    entryComponents: [
    ],
    providers: [
        getSMSService,
        postSMSService,
        ExamService,
        AttendanceReportServiceService,
        getEmailService,
        postEmailService,
        timeTableService,
        BiometricServiceService,
        ProfitLossServiceService,
        ExcelService,
        ExportToPdfService
    ],
    exports: [

    ]
})
export class ReportModule {

}
