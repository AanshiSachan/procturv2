import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherComponent } from './teacher.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { ComingSoonComponent } from '../coming-soon/coming-soon.component';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherAPIService } from '../../services/teacherService/teacherApi.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    TeacherRoutingModule,
    FormsModule,
    CommonModule
  ],
  declarations: [
    TeacherComponent,
    TeacherListComponent
  ],
  providers: [
    TeacherAPIService
  ]
})
export class TeacherModule { }
