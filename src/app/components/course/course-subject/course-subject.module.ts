import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseSubjectComponent } from './course-subject.component';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker/bs-datepicker.module';
import { SubjectApiService } from '../../../services/course-services/subject.service';
import { CourseSubjectRouting } from './course-subject.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        SharedModule,
        CourseSubjectRouting
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