import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from '../../../../assets/imported_modules/ngx-bootstrap/datepicker';
import 'moment';
import 'hammerjs';
import { SharedModule } from '../../shared/shared.module';
import { ChequeManageComponent } from './cheque-manage/cheque-manage.component';
import { FeeManageComponent } from './fee-manage/fee-manage.component';
import { FeeActivityRoutingModule } from './fee-activity-routing.module';
import { getCheque } from '../../../services/cheque-manage/get-cheque.service';
import { ExcelService } from '../../../services/excel.service';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
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
        getCheque,
        ExcelService
    ]
})
export class FeeActivityModule {

}