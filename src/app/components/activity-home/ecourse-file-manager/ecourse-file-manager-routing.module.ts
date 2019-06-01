import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EcourseListComponent } from './ecourse-list/ecourse-list.component';
import { EcourseFileManagerComponent } from './ecourse-file-manager.component';
import { EcourseSubjectListComponent } from './ecourse-subject-list/ecourse-subject-list.component';
import { MaterialWebComponent } from './material-web/material-web.component';

const routes: Routes = [
  {
      path: '',
      component: EcourseFileManagerComponent,
      pathMatch: 'prefix',
      children: [
          {
              path: '',
              redirectTo: 'ecourses'
          },
          {
              path: 'ecourses',
              component: EcourseListComponent
          },
          {
              path: 'ecourses/:ecourse_id/subjects',
              component: EcourseSubjectListComponent
          },
          {
              path: 'ecourses/:ecourse_id/subjects/:subject_id/materials',
              component: MaterialWebComponent
          }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcourseFileManagerRoutingModule { }
