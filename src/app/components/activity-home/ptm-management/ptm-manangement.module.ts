import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

import { BsDatepickerModule } from '../../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { PtmManagementComponent } from './ptm-management.component';
import { ActivityPtmService } from '../../../services/activity-ptmservice/activity-ptm.service';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: PtmManagementComponent
            },
            {
                path: 'ptm',
                component: PtmManagementComponent,
            }
                
        ]),
        SharedModule,
        FormsModule,
        BsDatepickerModule
    ],
    exports: [
        RouterModule
    ],
    declarations: [
        PtmManagementComponent
    ],
    providers: [
      ActivityPtmService
    ]
})

export class ManageExamModule{




}