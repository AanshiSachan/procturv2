import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourseClassRouting } from './course-class.routing.module';
import { CourseClassComponent } from './course-class.component';
import { ClassHomeComponent, DateFormat } from './class-home/class-home.component';
import { ClassAddComponent } from './class-add/class-add.component';
import 'moment';
import 'hammerjs';
import { BsDatepickerModule } from '../../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { TimepickerModule } from '../../../../assets/imported_modules/ngx-bootstrap/timepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { ClassScheduleService } from '../../../services/course-services/class-schedule.service';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        TimepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule,
        SharedModule,
        CourseClassRouting
    ],
    exports: [],
    declarations: [
        CourseClassComponent,
        ClassHomeComponent,
        ClassAddComponent,
        DateFormat
    ],
    providers: [
        ClassScheduleService
    ]
})

export class CourseClassModule {

}