import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseExamComponent } from './course-exam.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CourseExamComponent,
                pathMatch: 'prefix',
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class CourseExamRouting {

}