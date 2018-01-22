import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CourseComponent } from './course.component';
import { CourseSubjectComponent } from './course-subject/course-subject.component';
import { CourseExamComponent } from './course-exam/course-exam.component';
import { CourseCourseListComponent } from './course-course-list/course-course-list.component';
import { CourseClassComponent } from './course-class/course-class.component';
import { ScheduleHomeComponent } from './course-home/schedule-home.component';

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
                        redirectTo: 'standardlist'
                    },
                    {
                        path: 'standardlist',
                        component: ScheduleHomeComponent,
                        pathMatch: 'prefix',
                    },
                    {
                        path: 'subject',
                        component: CourseSubjectComponent,
                        pathMatch: 'prefix',
                    },
                    {
                        path: 'exam',
                        component: CourseExamComponent,
                        pathMatch: 'prefix',
                    },
                    {
                        path: 'courselist',
                        component: CourseCourseListComponent,
                        pathMatch: 'prefix',
                    },
                    {
                        path: 'class',
                        component: CourseClassComponent,
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