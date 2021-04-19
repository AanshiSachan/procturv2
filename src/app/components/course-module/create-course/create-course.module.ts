import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateCourseComponent } from './create-course.component';

import { CreateCourseRoutingModule } from './create-course-routing.module';
/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CourseInput } from './course-directives/course-directives.directive';
// import {BsDatepickerConfig, BsDatepickerModule} from 'ngx-bootstrap/datepicker';
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
  ],
  exports: [
    CreateCourseComponent
  ]
})
export class CreateCourseModule { }
