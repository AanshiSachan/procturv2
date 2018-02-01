import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from '../../../../assets/imported_modules/ngx-bootstrap/datepicker/bs-datepicker.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourseClassRouting } from './course-class.routing.module';
import { CourseClassComponent } from './course-class.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        SharedModule,
        CourseClassRouting
    ],
    exports: [],
    declarations: [
        CourseClassComponent 
    ],
    providers: [
    ]
})

export class CourseClassModule {

}