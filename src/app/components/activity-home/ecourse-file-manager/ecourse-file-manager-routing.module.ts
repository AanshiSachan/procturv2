import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EcourseListComponent } from './ecourse-list/ecourse-list.component';
import { EcourseFileManagerComponent } from './ecourse-file-manager.component';

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
          }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EcourseFileManagerRoutingModule { }
