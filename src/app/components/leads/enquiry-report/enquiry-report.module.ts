import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReferredByComponent } from "./referred-by/referred-by.component";
import { SourceComponent } from "./source/source.component";
import { CounsellorReportComponent } from "./counsellor-report/counsellor-report.component";
import { EnquiryHomeComponent } from './enquiry-home/enquiry-home.component';
import { EnquiryReportRoutingModule } from "./enquiry-report-routing.module";
import { EnquiryReportComponent } from "./enquiry-report.component";
import { EnquiryReportService } from "../../../services/counsellor-service/counsellor-service.service";
import { SharedModule } from "../../shared/shared.module";
import { BsDatepickerModule } from "ngx-bootstrap-custome";


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        EnquiryReportRoutingModule,
        SharedModule,
        BsDatepickerModule,
    ],
    exports: [

    ],
    entryComponents: [
        EnquiryHomeComponent,
        ReferredByComponent,
        SourceComponent,
        CounsellorReportComponent
    ],
    declarations: [
        ReferredByComponent,
        SourceComponent,
        CounsellorReportComponent,
        EnquiryHomeComponent,
        EnquiryReportComponent,

    ],

    providers : [
        EnquiryReportService
    ]
})

export class EnquiryReportModule {

}
