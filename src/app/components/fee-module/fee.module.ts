import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem, Tooltip } from 'primeng/primeng';
import { BsDatepickerModule, TimepickerModule, TooltipModule } from 'ngx-bootstrap-custome';
import { MessageService } from 'primeng/components/common/messageservice';
import { SharedModule } from '../shared/shared.module';
import { GetFeeService } from '../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../services/report-services/fee-services/postFee.service';
import { PaymentHistoryMainService } from '../../services/payment-history/payment-history-main.service';
import { ExcelService } from '../../services/excel.service';
import { OnlinePaymentServiceService } from '../../services/online-payment/online-payment-service.service';
import { ExportToPdfService } from '../../services/export-to-pdf.service';
import { getCheque } from '../../services/cheque-manage/get-cheque.service';
import { FeeRoutingModule } from './fee-module-routing.module';
import { FeeWidgetComponent, FeeComponent, FeeCourseReportComponent, FeeReportHomeComponent, AllDataReportComponent, InactiveStudentReportComponent, OnlinePaymentHistoryComponent, ChequeManageComponent, PaymentHistoryMainComponent, FeeReceiptComponent, ViewDetailComponent, NextDueDetailComponent, PaymentHistoryComponent, GstReportComponent } from '.';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';


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
        OnlinePaymentHistoryComponent,
        ChequeManageComponent,
        PaymentHistoryMainComponent,
        FeeWidgetComponent,
        GstReportComponent,
        ProfitLossComponent 
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
