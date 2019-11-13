import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCourseComponent } from './create-course.component';

import { CreateCourseRoutingModule } from './create-course-routing.module';
/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CourseInput } from './course-directives/course-directives.directive';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CreateCourseRoutingModule
  ],
  declarations: [
    CreateCourseComponent
  ],
  entryComponents: [

  ],
  providers: [
  ]
})
export class CreateCourseModule { }
