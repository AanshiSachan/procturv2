import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker/bs-datepicker.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourseListService } from '../../../services/course-services/course-list.service';
import { CourseCourseListComponent } from './course-course-list.component';
import { CourseListRouting } from './course-list.routing.module';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { CourseAddComponent, DateMonthFormatter } from './course-add/course-add.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        SharedModule,
        CourseListRouting
    ],
    exports: [],
    declarations: [
        CourseCourseListComponent,
        CourseEditComponent,
        CourseAddComponent,
        DateMonthFormatter,    ],
    providers: [
        CourseListService,
    ]
})

export class CourseListModule {

}