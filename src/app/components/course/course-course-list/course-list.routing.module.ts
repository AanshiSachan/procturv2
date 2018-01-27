import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseCourseListComponent } from './course-course-list.component';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { CourseAddComponent } from './course-add/course-add.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CourseCourseListComponent,
                pathMatch: 'prefix',
            },
            {
                path: 'add',
                component: CourseAddComponent,
                pathMatch: 'prefix'
            },
            {
                path: ':course_name',
                component: CourseEditComponent,
                pathMatch: 'prefix'
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class CourseListRouting {

}