import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopicTreeComponent } from './topic-tree/topic-tree.component';
import { TopicBulkUploadComponent } from './topic-bulk-upload/topic-bulk-upload.component';

const routes: Routes = [  {
  path: '',
  component: TopicTreeComponent,
  pathMatch: 'prefix',
  children: [
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
