import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FileManagerComponent } from './file-manager.component';
import { DriveHomeComponent } from './drive-home/drive-home.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: FileManagerComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        redirectTo: 'drive'
                    },
                    {
                        path: 'drive',
                        component: DriveHomeComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class FileManagerRoutingModule {
}