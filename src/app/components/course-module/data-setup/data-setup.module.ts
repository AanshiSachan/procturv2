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
import { MasterTagComponent } from './master-tag/master-tag.component';
import { MarkDistributionComponent } from './mark-distribution/mark-distribution.component';
import { MarkSettingComponent } from './mark-setting/mark-setting.component';

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
    SchoolExamTypeComponent,
    MasterTagComponent,
    MarkDistributionComponent,
    MarkSettingComponent
  ],
  providers: [
      ExamGradeServiceService,
      ClassRoomService
  ]
})
export class DataSetupModule { }
