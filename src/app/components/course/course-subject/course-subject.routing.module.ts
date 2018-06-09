import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseSubjectComponent } from './course-subject.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CourseSubjectComponent,
                pathMatch: 'prefix',
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class CourseSubjectRouting {

}