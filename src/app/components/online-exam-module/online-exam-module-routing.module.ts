import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnlineExamModuleComponent, OnlineExamHomeComponent, ExamdeskCourseAssignmentComponent } from '.';
import { EcourseMappingComponent } from '../eStore-module';

const routes: Routes = [
  {
    path: '',
    component: OnlineExamModuleComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        component: OnlineExamHomeComponent
      },
      {
        path: 'ecoursemapping',
        component: EcourseMappingComponent,
        pathMatch: 'prefix'
    }
    ]
  },
  {
    path: 'examcourse',
    component: ExamdeskCourseAssignmentComponent,
    pathMatch: 'prefix'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineExamModuleRoutingModule { }
