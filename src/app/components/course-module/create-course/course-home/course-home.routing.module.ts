import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScheduleHomeComponent } from './schedule-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ScheduleHomeComponent,
                pathMatch: 'prefix',
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class CourseHomeRouting {
    
}