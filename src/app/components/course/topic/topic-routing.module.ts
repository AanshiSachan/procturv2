import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopicTreeComponent } from './topic-tree/topic-tree.component';

const routes: Routes = [  {
  path: '',
  component: TopicTreeComponent,
  pathMatch: 'prefix',
  children: [
      // {
      //     path: 'home',
      //     component: HomeComponent
      // }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopicRoutingModule { }
