import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcourseFileManagerComponent } from './ecourse-file-manager.component';
import { EcourseFileManagerRoutingModule } from './ecourse-file-manager-routing.module';
import { EcourseListComponent } from './ecourse-list/ecourse-list.component';

@NgModule({
  imports: [
    CommonModule,
    EcourseFileManagerRoutingModule
  ],
  declarations: [
    EcourseFileManagerComponent, 
    EcourseListComponent
  ]
})
export class EcourseFileManagerModule { }
