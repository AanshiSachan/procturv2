import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
/* Modules */
import { FormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { TimepickerModule } from 'ngx-bootstrap-custome/timepicker';
import { FileUploadModule, MenuModule, SplitButtonModule } from 'primeng/primeng';
import { ExcelService } from '../../../services/excel.service';
// import { ExamReportComponent } from './exam-report/exam-report.component';
import { ExamService } from '../../../services/report-services/exam.service';
import { SharedModule } from '../../shared/shared.module';
import { AttendanceReportServiceService } from '../services/attendance-report-service.service';
import { AttendanceReportComponent } from './attendance-report/attendanceReport.component';
import { BiometricComponent } from './biometric/biometric.component';
import { ExamReportMainComponent } from './exam-report-main/exam-report.component';
import { FilterPipe } from './exam-report-main/filter.pipe';
import { ReportHomeComponent } from './report-home/report-home.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';





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
    AttendanceReportServiceService
  ],
})
export class ReportsModule { }
