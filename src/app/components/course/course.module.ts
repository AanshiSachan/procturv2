import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseComponent } from './course.component';
import { ScheduleHomeComponent } from './schedule-home/schedule-home.component';
import { CoursePageRoutingModule } from './course-routing.module';
/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CourseInput } from './course-directives/course-directives.directive';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        CoursePageRoutingModule
      ],
    declarations: [
        CourseComponent,
        ScheduleHomeComponent,
        CourseInput
    ],
    entryComponents: [
      ],
    providers: [
    ]  
})
export class CourseModule {
    
}