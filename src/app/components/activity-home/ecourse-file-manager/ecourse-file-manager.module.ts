import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EcourseFileManagerComponent } from './ecourse-file-manager.component';
import { EcourseFileManagerRoutingModule } from './ecourse-file-manager-routing.module';
import { EcourseListComponent } from './ecourse-list/ecourse-list.component';
import { UploadFileComponent } from './core/upload-file/upload-file.component';
import { EcourseSubjectListComponent } from './ecourse-subject-list/ecourse-subject-list.component';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  imports: [
    CommonModule,
    EcourseFileManagerRoutingModule,
    FileUploadModule
  ],
  declarations: [
    EcourseFileManagerComponent,
    EcourseListComponent,
    UploadFileComponent,
    EcourseSubjectListComponent
  ]
})
export class EcourseFileManagerModule { }
