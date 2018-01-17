import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherComponent } from './teacher.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { ComingSoonComponent } from '../coming-soon/coming-soon.component';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherAPIService } from '../../services/teacherService/teacherApi.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TeacherAddComponent } from './teacher-add/teacher-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TeacherEditComponent } from './teacher-edit/teacher-edit.component';

@NgModule({
  imports: [
    SharedModule,
    TeacherRoutingModule,
    ReactiveFormsModule 
  ],
  declarations: [
    TeacherComponent,
    TeacherListComponent,
    TeacherAddComponent,
    TeacherEditComponent,
  ],
  providers: [
    TeacherAPIService
  ]
})
export class TeacherModule { }
