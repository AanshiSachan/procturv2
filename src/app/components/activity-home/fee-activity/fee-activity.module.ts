import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from '../../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import 'moment';
import 'hammerjs';
import { SharedModule } from '../../shared/shared.module';
import { ChequeManageComponent } from './cheque-manage/cheque-manage.component';
import { FeeManageComponent } from './fee-manage/fee-manage.component';
import { FeeActivityRoutingModule } from './fee-activity-routing.module';
import {manageCheque} from '../../../services/cheque-manage/cheque-manage.service';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule,
        SharedModule,
        FeeActivityRoutingModule
    ],
    declarations: [
        ChequeManageComponent,
        FeeManageComponent
    ],
    entryComponents: [
    ],
    providers: [
        manageCheque
    ]
})
export class FeeActivityModule {

}