import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateCourseComponent } from './create-course.component';


@NgModule({
    imports: [RouterModule.forChild([
        {
            path: '',
            component: CreateCourseComponent,
            pathMatch: 'prefix',
            children: [
                {
                    path: '',
                    redirectTo: 'standardlist'
                },
                {
                    path: 'standardlist',
                    loadChildren: 'app/components/course-module/create-course//course-home/course-home.module#CourseHomeModule',
                    pathMatch: 'prefix',
                },
                {
                    path: 'subject',
                    loadChildren: "app/components/course-module/create-course/course-subject/course-subject.module#CourseSubjectModule",
                    pathMatch: 'prefix',
                },
                {
                    path: 'exam',
                    loadChildren: "app/components/course-module/create-course/course-exam/course-exam.module#CourseExamModule",
                    pathMatch: 'prefix',
                },
                {
                    path: 'topic',
                    loadChildren: "app/components/course-module/create-course/topic/topic.module#TopicModule",
                    pathMatch: 'prefix',
                },
                {
                    path: 'courselist',
                    loadChildren: "app/components/course-module/create-course/course-course-list/course-list.module#CourseListModule",
                    pathMatch: 'prefix',
                },
                {
                    path: 'class',
                    loadChildren: "app/components/course-module/create-course/course-class/course-class.module#CourseClassModule",
                    pathMatch: 'prefix',
                },
                {
                    path: 'managebatch',
                    loadChildren: "app/components/course-module/create-course/manage-batch/manage-batch.module#ManageBatchModule",
                    pathMatch: 'prefix',
                }
            ]
        }
    ])],
    exports: [RouterModule]
})
export class CreateCourseRoutingModule { }
