import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherComponent } from './teacher.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherAPIService } from '../../../../services/teacherService/teacherApi.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { TeacherAddComponent } from './teacher-add/teacher-add.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TeacherEditComponent } from './teacher-edit/teacher-edit.component';
import { TeacherViewComponent } from './teacher-view/teacher-view.component';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';

@NgModule({
  imports: [
    BsDatepickerModule,
    SharedModule,
    TeacherRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    TeacherComponent,
    TeacherListComponent,
    TeacherAddComponent,
    TeacherEditComponent,
    TeacherViewComponent,
  ],
  providers: [
    TeacherAPIService
  ]
})
export class TeacherModule { }
