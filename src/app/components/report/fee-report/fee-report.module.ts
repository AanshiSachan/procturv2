import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Modules */
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from '../../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { FeeReportComponent } from './fee-report.component';
import { FeeCourseReportComponent } from './fee-course-report/fee-course-report.component';
import { GetFeeService } from '../../../services/report-services/fee-services/getFee.service';
import { PostFeeService } from '../../../services/report-services/fee-services/postFee.service';

import { FeeReportRoutingModule } from './fee-report-routing.module';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        SharedModule,
        FeeReportRoutingModule
    ],
    declarations: [
        FeeReportComponent,
        FeeCourseReportComponent
    ],
    entryComponents: [
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
