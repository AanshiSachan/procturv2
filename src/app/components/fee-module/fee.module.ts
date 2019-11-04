import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";



import { FeeCourseReportComponent } from './fee-course-report/fee-course-report.component';

import { FeeReceiptComponent } from './fee-receipt/fee-receipt.component';
import { NextDueDetailComponent } from './next-due-detail/next-due-detail.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { ViewDetailComponent } from './view-detail-report/view-detail-report.component';

import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem, Tooltip } from 'primeng/primeng';




import { FeeReportHomeComponent } from './fee-report-home/fee-report-home.component';
import { AllDataReportComponent } from './all-data-report/all-data-report.component';
import { InactiveStudentReportComponent } from './inactive-student-report/inactive-student-report.component';
import { GstReportComponent } from './gst-report/gst-report.component';
import { OnlinePaymentHistoryComponent } from './online-payment-history/online-payment-history.component';
import { PaymentHistoryMainComponent } from './payment-history-main/payment-history-main.component';
import { FeeWidgetComponent } from './fee-widget/fee-widget.component';
import { BsDatepickerModule, TimepickerModule, TooltipModule } from 'ngx-bootstrap-custome';
import { MessageService } from 'primeng/components/common/messageservice';
import { ChequeManageComponent } from './cheque-manage/cheque-manage.component';
import { SharedModule } from '../shared/shared.module';
import { GetFeeService } from '../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../services/report-services/fee-services/postFee.service';
import { PaymentHistoryMainService } from '../../services/payment-history/payment-history-main.service';
import { ExcelService } from '../../services/excel.service';
import { OnlinePaymentServiceService } from '../../services/online-payment/online-payment-service.service';
import { ExportToPdfService } from '../../services/export-to-pdf.service';
import { getCheque } from '../../services/cheque-manage/get-cheque.service';
import { FeeComponent } from './fee-module.component';
import { FeeRoutingModule } from './fee-module-routing.module';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        FeeRoutingModule,
        SplitButtonModule,
        MenuModule,
        SharedModule,
        TooltipModule.forRoot(),
        BsDatepickerModule,
        TimepickerModule
    ],
    declarations: [
        FeeComponent,
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
        ChequeManageComponent,
        PaymentHistoryMainComponent,
        FeeWidgetComponent
    ],
    entryComponents: [
        FeeReportHomeComponent,
        FeeReceiptComponent,
        NextDueDetailComponent,
        PaymentHistoryComponent,
        ViewDetailComponent,
        FeeWidgetComponent
    ],
    providers: [
        GetFeeService,
        PostFeeService,
        PaymentHistoryMainService,
        ExcelService,
        OnlinePaymentServiceService,
        ExportToPdfService,
        MessageService,
        getCheque
    ],
    exports: [
    ]
})
export class FeeModule {

}
