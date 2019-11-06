import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopicRoutingModule } from './topic-routing.module';
import { TopicListComponent } from './topic-list/topic-list.component';
import { TopicTreeComponent } from './topic-tree/topic-tree.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '../../../../../node_modules/@angular/forms';
import { TopicComponent } from './topic.component';

@NgModule({
  imports: [
    CommonModule,
    TopicRoutingModule,
    FormsModule ,
    SharedModule
  ],
  declarations: [
    TopicListComponent,
    TopicTreeComponent,
    TopicComponent
  ]
})
export class TopicModule { }
