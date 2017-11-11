import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { CourseComponent } from './course.component';
import { ScheduleHomeComponent } from './schedule-home/schedule-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CourseComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        component: ScheduleHomeComponent
                    },
                    {
                        path: 'courseHome',
                        component: ScheduleHomeComponent,
                        pathMatch: 'prefix',
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CoursePageRoutingModule {
}