import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker/bs-datepicker.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourseExamComponent, DateMonthFormat } from './course-exam.component';
import { CourseExamRouting } from './course-exam.routing.module';
import { ExamCourseService } from '../../../services/course-services/exam-schedule.service';
//import { SplitButtonModule, MenuModule, MenuItem, SelectButtonModule, TabViewModule, ButtonModule } from 'primeng/primeng';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        SharedModule,
        CourseExamRouting,
        // SplitButtonModule, 
        // MenuModule,
        // SelectButtonModule, 
        // TabViewModule, 
        // ButtonModule
    ],
    exports: [],
    declarations: [
        CourseExamComponent,
        DateMonthFormat
    ],
    providers: [
        ExamCourseService
    ]
})

export class CourseExamModule {

}