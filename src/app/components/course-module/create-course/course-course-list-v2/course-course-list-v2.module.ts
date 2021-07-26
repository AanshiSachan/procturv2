import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseCourseListV2RoutingModule } from './course-course-list-v2-routing.module';
import { CourseCourseListV2Component } from '../course-course-list-v2/course-course-list-v2.component';
import { SharedModule } from '../../../shared/shared.module';
import { CourseAddComponent } from './course-add/course-add.component';


@NgModule({
  declarations: [CourseCourseListV2Component, CourseAddComponent],
  imports: [
    CommonModule,
    CourseCourseListV2RoutingModule,
    SharedModule,
  ]
})
export class CourseCourseListV2Module { }
