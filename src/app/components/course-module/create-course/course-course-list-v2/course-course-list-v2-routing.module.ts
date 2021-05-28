import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseCourseListV2Component } from './course-course-list-v2.component';
import { CourseAddComponent } from './course-add/course-add.component';


const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: '',
            component: CourseCourseListV2Component,
            pathMatch: 'prefix',
        },
        {
            path: 'add',
            component: CourseAddComponent,
            pathMatch: 'prefix'
        },
        {
            path: 'edit/:id',
            component: CourseAddComponent,
            pathMatch: 'prefix'
        }
    ])
],
  exports: [RouterModule]
})
export class CourseCourseListV2RoutingModule { }
