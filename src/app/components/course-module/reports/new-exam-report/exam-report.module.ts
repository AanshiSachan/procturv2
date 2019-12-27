import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Modules */
import { NewExamReportComponent } from './new-exam-report.component';
import { CourseWiseComponent } from './course-wise/course-wise.component';
import { ExamWiseComponent } from './exam-wise/exam-wise.component';
import { TeacherPerformanceComponent } from './teacher-performance/teacher-performance.component';

import { ExamReportRoutingModule } from './exam-report-routing.module';
import { MessageService } from 'primeng/components/common/messageservice';
import { BsDatepickerModule, TimepickerModule, TooltipModule } from 'ngx-bootstrap-custome';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { ExamReportHomeComponent } from './exam-report-home/exam-report-home.component';
import { SharedModule } from '../../../shared/shared.module';
import { ClassScheduleService } from '../../../../services/course-services/class-schedule.service';


@NgModule({
  imports: [
    CommonModule,    
    ExamReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ExamReportRoutingModule,
    SplitButtonModule,
    MenuModule,
    SharedModule,
    TooltipModule.forRoot(),
    BsDatepickerModule,
    TimepickerModule
  ],
  declarations: [
    NewExamReportComponent,
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
  exports: [
      // FilterPipe
  ]
})
export class ExamReportModule { }
