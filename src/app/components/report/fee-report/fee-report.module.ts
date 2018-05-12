import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from '../../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { TooltipModule  } from '../../../../assets/imported_modules/ngx-bootstrap/tooltip';


import { FeeReportComponent } from './fee-report.component';
import { FeeCourseReportComponent } from './fee-course-report/fee-course-report.component';

import { FeeReceiptComponent } from './fee-receipt/fee-receipt.component';
import { NextDueDetailComponent } from './next-due-detail/next-due-detail.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { ViewDetailComponent } from './view-detail-report/view-detail-report.component';

import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';

import { GetFeeService } from '../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../services/report-services/fee-services/postFee.service';

import { FeeReportRoutingModule } from './fee-report-routing.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        TooltipModule.forRoot(),
        SharedModule,
        FeeReportRoutingModule,
        SplitButtonModule,
        MenuModule,
    ],
    declarations: [
        FeeReportComponent,
        FeeCourseReportComponent,
        FeeReceiptComponent,
        NextDueDetailComponent,
        PaymentHistoryComponent,
        ViewDetailComponent
    ],
    entryComponents: [
        FeeReceiptComponent,
        NextDueDetailComponent,
        PaymentHistoryComponent,
        ViewDetailComponent
    ],
    providers: [
        GetFeeService,
        PostFeeService
    ],
    exports: [
    ]
})
export class FeeReportModule {

}
