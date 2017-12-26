import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseComponent } from './course.component';
import { ScheduleHomeComponent } from './schedule-home/schedule-home.component';
import { CoursePageRoutingModule } from './course-routing.module';
/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CourseInput } from './course-directives/course-directives.directive';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        CoursePageRoutingModule,
        BsDatepickerModule
    ],
    declarations: [
        CourseComponent,
        ScheduleHomeComponent,
        CourseInput,
        PaginationComponent
    ],
    entryComponents: [
    ],
    providers: [
    ]
})
export class CourseModule {

}