import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import 'moment';
import 'hammerjs';
import { SharedModule } from '../../shared/shared.module';
import { TreeModule } from 'primeng/tree';

import { FileManagerComponent } from './file-manager.component';
import { FileManagerRoutingModule } from './file-manager-routing.module';
import { DriveHomeComponent } from './drive-home/drive-home.component';
import { FileCardComponent } from './file-card/file-card.component';

import { FileManagerService } from './file-manager.service';
import { UploadPopupComponent } from './upload-popup/upload-popup.component';
import { ShareFileComponent } from './share-file/share-file.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        SharedModule,
        FileManagerRoutingModule,
        TreeModule,
        FileUploadModule
    ],
    declarations: [
        FileManagerComponent,
        DriveHomeComponent,
        FileCardComponent,
        UploadPopupComponent,
        ShareFileComponent
    ],
    entryComponents: [
        FileCardComponent
    ],
    providers: [
        FileManagerService
    ]
})
export class FileManagerModule {

}