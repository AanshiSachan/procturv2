import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseSubjectComponent } from './course-subject.component';
import { SharedModule } from '../../../shared/shared.module';
// import {BsDatepickerConfig, BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { SubjectApiService } from '../../../../services/course-services/subject.service';
import { CourseSubjectRouting } from './course-subject.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateCourseModule } from '../create-course.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        // BsDatepickerModule,
        SharedModule,
        CourseSubjectRouting,
        CreateCourseModule
    ],
    exports: [],
    declarations: [
        CourseSubjectComponent
    ],
    providers: [
        SubjectApiService
    ]
})

export class CourseSubjectModule {

}
