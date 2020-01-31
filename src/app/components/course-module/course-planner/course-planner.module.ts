import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import 'moment';
import { SharedModule } from "../../shared/shared.module";

import { CoursePlannerRoutingModule } from './course-planner-routing.module';
import { CoursePlannerComponent } from './course-planner.component';
import { ClassComponent } from './class/class.component';
import { ExamComponent } from './exam/exam.component';
import { ClassScheduleService } from '../../../services/course-services/class-schedule.service';
import { WidgetService } from '../../../services/widget.service';
import { TopicListingService } from '../../../services/course-services/topic-listing.service';
import { ExamCourseService } from '../../../services/course-services/exam-schedule.service';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    CommonModule,
    SharedModule,
    CoursePlannerRoutingModule
  ],
  declarations: [
    CoursePlannerComponent,
    ClassComponent,
    ExamComponent,
  ],
  entryComponents:[
    CoursePlannerComponent
  ],
  exports: [],
  providers: [
      ClassScheduleService,
      WidgetService,
      TopicListingService,
      ExamCourseService
  ]
})
export class CoursePlannerModule { }
