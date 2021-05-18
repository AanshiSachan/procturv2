import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EcourseMappingComponent } from '../ecourse-mapping/ecourse-mapping.component';
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
                    loadChildren: () => import('app/components/course-module/create-course/course-home/course-home.module').then(m => m.CourseHomeModule),
                    // loadChildren: 'app/components/course-module/create-course//course-home/course-home.module#CourseHomeModule',
                    pathMatch: 'prefix',
                },
                {
                    path: 'subject',
                    loadChildren: () => import('app/components/course-module/create-course/course-subject/course-subject.module').then(m => m.CourseSubjectModule),
                    // loadChildren: "app/components/course-module/create-course/course-subject/course-subject.module#CourseSubjectModule",
                    pathMatch: 'prefix',
                },
                {
                    path: 'exam',
                    loadChildren: () => import('app/components/course-module/create-course/course-exam/course-exam.module').then(m => m.CourseExamModule),
                    // loadChildren: "app/components/course-module/create-course/course-exam/course-exam.module#CourseExamModule",
                    pathMatch: 'prefix',
                },
                {
                    path: 'topic',
                    loadChildren: () => import('app/components/course-module/create-course/topic/topic.module').then(m => m.TopicModule),
                    // loadChildren: "app/components/course-module/create-course/topic/topic.module#TopicModule",
                    pathMatch: 'prefix',
                },
                {
                    path: 'courselist',
                    loadChildren: () => import('./course-course-list-v2/course-course-list-v2.module').then(m => m.CourseCourseListV2Module),
                    // loadChildren: "app/components/course-module/create-course/course-course-list/course-list.module#CourseListModule",
                    pathMatch: 'prefix',
                },
                {
                    path: 'class',
                    loadChildren: () => import('app/components/course-module/create-course/course-class/course-class.module').then(m => m.CourseClassModule),
                    // loadChildren: "app/components/course-module/create-course/course-class/course-class.module#CourseClassModule",
                    pathMatch: 'prefix',
                },
                {
                    path: 'managebatch',
                    loadChildren: () => import('app/components/course-module/create-course/manage-batch/manage-batch.module').then(m => m.ManageBatchModule),
                    // loadChildren: "app/components/course-module/create-course/manage-batch/manage-batch.module#ManageBatchModule",
                    pathMatch: 'prefix',
                },
                {
                    path:'ecoursemapping',
                    component: EcourseMappingComponent,
                    pathMatch:'prefix'
                },
                {
                    path: 'routine',
                    // component: AnalyticsComponent
                    loadChildren: () => import('./routine/routine.module').then(m => m.RoutineModule),
                    pathMatch: 'prefix',
                  }
            ]
        }
    ])],
    exports: [RouterModule]
})
export class CreateCourseRoutingModule { }
