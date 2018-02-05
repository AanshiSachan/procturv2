import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseClassComponent } from './course-class.component';
import { ClassHomeComponent } from './class-home/class-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CourseClassComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        redirectTo: 'home'
                    },
                    {
                        path: 'home',
                        component: ClassHomeComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class CourseClassRouting {

}