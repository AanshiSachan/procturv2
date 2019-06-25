import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import 'moment';
import 'hammerjs';
import { SharedModule } from '../../shared/shared.module';
import { ChequeManageComponent } from './cheque-manage/cheque-manage.component';
import { FeeManageComponent } from './fee-manage/fee-manage.component';
import { FeeActivityRoutingModule } from './fee-activity-routing.module';
import { getCheque } from '../../../services/cheque-manage/get-cheque.service';
import { ExcelService } from '../../../services/excel.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';

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
        ExcelService,
        ExportToPdfService
    ]
})
export class FeeActivityModule {

}