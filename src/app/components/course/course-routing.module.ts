import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CourseComponent } from './course.component';


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
                        loadChildren: 'app/components/course/course-home/course-home.module#CourseHomeModule',
                        pathMatch: 'prefix',
                    },
                    {
                        path: 'subject',
                        loadChildren: "app/components/course/course-subject/course-subject.module#CourseSubjectModule",
                        pathMatch: 'prefix',
                    },
                    {
                        path: 'exam',
                        loadChildren: "app/components/course/course-exam/course-exam.module#CourseExamModule",
                        pathMatch: 'prefix',
                    },
                    {
                        path: 'courselist',
                        loadChildren: "app/components/course/course-course-list/course-list.module#CourseListModule",
                        pathMatch: 'prefix',
                    },
                    {
                        path: 'class',
                        loadChildren: "app/components/course/course-class/course-class.module#CourseClassModule",
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