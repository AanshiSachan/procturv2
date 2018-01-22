import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseComponent } from './course.component';
import { CoursePageRoutingModule } from './course-routing.module';
/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CourseInput } from './course-directives/course-directives.directive';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { SharedModule } from '../shared/shared.module';
import { CourseSubjectComponent } from './course-subject/course-subject.component';
import { CourseCourseListComponent } from './course-course-list/course-course-list.component';
import { CourseExamComponent } from './course-exam/course-exam.component';
import { CourseClassComponent } from './course-class/course-class.component';
import { ScheduleHomeComponent } from './course-home/schedule-home.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        CoursePageRoutingModule,
        BsDatepickerModule,
        SharedModule
    ],
    declarations: [
        CourseComponent,
        ScheduleHomeComponent,
        CourseInput,
        CourseSubjectComponent,
        CourseCourseListComponent,
        CourseExamComponent,
        CourseClassComponent
    ],
    entryComponents: [
    ],
    providers: [
    ]
})
export class CourseModule {

}