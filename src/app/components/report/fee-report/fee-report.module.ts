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
import { FeeReportHomeComponent } from './fee-report-home/fee-report-home.component';
import { AllDataReportComponent } from './all-data-report/all-data-report.component';
import { InactiveStudentReportComponent } from './inactive-student-report/inactive-student-report.component';
import { GstReportComponent } from './gst-report/gst-report.component';
import { OnlinePaymentHistoryComponent } from './online-payment-history/online-payment-history.component';
import { ChequeReportComponent } from './cheque-report/cheque-report.component';
import { DiscountReportComponent } from './discount-report/discount-report.component';
import { FeeTypeReportComponent } from './fee-type-report/fee-type-report.component';
import { PaymentHistoryMainComponent } from './payment-history-main/payment-history-main.component';
import { PaymentHistoryMainService } from '../../../services/payment-history/payment-history-main.service';

import { ExcelService } from '../../../services/excel.service';

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
        ViewDetailComponent,
        FeeReportHomeComponent,
        AllDataReportComponent,
        InactiveStudentReportComponent,
        GstReportComponent,
        OnlinePaymentHistoryComponent,
        ChequeReportComponent,
        DiscountReportComponent,
        FeeTypeReportComponent,
        PaymentHistoryMainComponent
    ],
    entryComponents: [
        FeeReportHomeComponent,
        FeeReceiptComponent,
        NextDueDetailComponent,
        PaymentHistoryComponent,
        ViewDetailComponent
    ],
    providers: [
        GetFeeService,
        PostFeeService,
        PaymentHistoryMainService,
        ExcelService
    ],
    exports: [
    ]
})
export class FeeReportModule {

}