import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineExamModuleRoutingModule } from './online-exam-module-routing.module';
import { OnlineExamModuleComponent, OnlineExamHomeComponent, ExamdeskCourseAssignmentComponent } from '.';
import { SharedModule } from '../shared/shared.module';
import { ExamDeskCourseAssignmentService } from '../../services/examdesk-service/examdeskcourseassignment.service';
import { EstoreModule } from '../eStore-module/estore.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EstoreModule,
    OnlineExamModuleRoutingModule
  ],
  declarations: [
    OnlineExamModuleComponent, 
    OnlineExamHomeComponent,
    ExamdeskCourseAssignmentComponent
  ],
  providers:[ExamDeskCourseAssignmentService]
})
export class OnlineExamModule { }
