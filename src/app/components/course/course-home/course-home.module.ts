import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker/bs-datepicker.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScheduleHomeComponent } from './schedule-home.component';
import { StandardServices } from '../../../services/course-services/standard.service';
import { CourseHomeRouting } from './course-home.routing.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        SharedModule,
        CourseHomeRouting
    ],
    exports: [],
    declarations: [
        ScheduleHomeComponent
    ],
    providers: [
        StandardServices
    ]
})

export class CourseHomeModule {

}