import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportHomeComponent } from './report-home/report-home.component';
import { AttendanceReportComponent } from './attendance-report/attendanceReport.component';

/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { TimepickerModule } from 'ngx-bootstrap-custome/timepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { SharedModule } from '../../shared/shared.module';
import { AttendanceReportServiceService } from '../services/attendance-report-service.service';
// import { ExamReportComponent } from './exam-report/exam-report.component';

import { ExamService } from '../../../services/report-services/exam.service';
import { ExamReportMainComponent } from './exam-report-main/exam-report.component';
import { FilterPipe } from './exam-report-main/filter.pipe';
import { ExcelService } from '../../../services/excel.service';
import { BiometricServiceService } from '../../../services/biometric-service/biometric-service.service';
import { BiometricComponent } from './biometric/biometric.component';



@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    BsDatepickerModule,
    TimepickerModule,
    FileUploadModule,
    SplitButtonModule,
    MenuModule,
    SharedModule
  ],
  declarations: [
    ReportsComponent,
    ReportHomeComponent,
    AttendanceReportComponent,
    ExamReportMainComponent,
    FilterPipe,
    BiometricComponent
  ],
  providers: [
    ExamService,
    ExcelService,
    BiometricServiceService,
    AttendanceReportServiceService
  ],
})
export class ReportsModule { }
