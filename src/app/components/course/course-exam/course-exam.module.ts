import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from '../../../../assets/imported_modules/ngx-bootstrap/datepicker/bs-datepicker.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourseExamComponent } from './course-exam.component';
import { CourseExamRouting } from './course-exam.routing.module';
import { ExamCourseService } from '../../../services/course-services/exam-schedule.service';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        SharedModule,
        CourseExamRouting
    ],
    exports: [],
    declarations: [
        CourseExamComponent,
    ],
    providers: [
        ExamCourseService
    ]
})

export class CourseExamModule {

}