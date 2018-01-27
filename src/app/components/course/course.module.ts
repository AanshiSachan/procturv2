import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseComponent } from './course.component';
import { CoursePageRoutingModule } from './course-routing.module';
/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CourseInput } from './course-directives/course-directives.directive';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        CoursePageRoutingModule,
        BsDatepickerModule,
        SharedModule,
    ],
    declarations: [
        CourseComponent,
        CourseInput,
    ],
    entryComponents: [
    ],
    providers: [
    ]
})
export class CourseModule {

}