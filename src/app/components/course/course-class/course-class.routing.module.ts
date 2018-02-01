import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseClassComponent } from './course-class.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CourseClassComponent,
                pathMatch: 'prefix',
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class CourseClassRouting {

}