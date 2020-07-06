import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopicTreeComponent } from './topic-tree/topic-tree.component';
import { TopicBulkUploadComponent } from './topic-bulk-upload/topic-bulk-upload.component';
import { TopicComponent } from './topic.component';

const routes: Routes = [  {
  path: '',
  component: TopicComponent,
  pathMatch: 'prefix',
  children: [
      {
          path: '',
          redirectTo: 'home'
      },
      {
          path: 'home',
          component: TopicTreeComponent
      },
      {
          path: 'bulkUpload',
          component: TopicBulkUploadComponent
      }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicRoutingModule { }
