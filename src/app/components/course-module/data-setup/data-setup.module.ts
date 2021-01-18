import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSetupComponent } from './data-setup.component';

import { ExamGradeServiceService } from '../../../services/examgradeservice/exam-grade-service.service';
import { ClassRoomService } from '../../../services/class-roomService/class-roomlist.service';

import { DataSetupRoutingModule } from './data-setup-routing.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from '../../shared/shared.module';
import { DataSetupHomeComponent } from './data-setup-home/data-setup-home.component';
import { ManageExamGradesComponent } from './manage-exam-grades/manage-exam-grades.component';
import { ClassRoomComponent } from './class-room/class-room.component';
import { SchoolExamTypeComponent } from './school-exam-type/school-exam-type.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataSetupRoutingModule,
    SharedModule   
  ],
  declarations: [
    DataSetupComponent,
    DataSetupHomeComponent,
    ManageExamGradesComponent,
    ClassRoomComponent,
    SchoolExamTypeComponent
  ],
  providers: [
      ExamGradeServiceService,
      ClassRoomService
  ]
})
export class DataSetupModule { }
