import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseWiseComponent } from './course-wise/course-wise.component';
import { ExamWiseComponent } from './exam-wise/exam-wise.component';
import { TeacherPerformanceComponent } from './teacher-performance/teacher-performance.component';
import { ExamReportHomeComponent } from './exam-report-home/exam-report-home.component';
import { ExamReportComponent } from './exam-report.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { BsDatepickerModule, TimepickerModule, TooltipModule } from 'ngx-bootstrap-custome';
import { ClassScheduleService } from '../../../../services/course-services/class-schedule.service';
import { ExamReportRoutingModule } from './exam-report-routing.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from '../../../shared/shared.module';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    ExamReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SplitButtonModule,
    MenuModule,
    SharedModule,
    TooltipModule.forRoot(),
    BsDatepickerModule,
    TimepickerModule
  ],
  declarations: [
    ExamReportComponent,
    CourseWiseComponent,
    ExamWiseComponent,
    TeacherPerformanceComponent,
    ExamReportHomeComponent
  ],
  entryComponents: [
    ExamReportHomeComponent
  ],
  providers:[
    MessageService,
    ClassScheduleService
  ],
})
export class ExamReportModule { }
