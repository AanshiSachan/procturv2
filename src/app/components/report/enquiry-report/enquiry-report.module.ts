import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BsDatepickerModule } from "../../../../assets/imported_modules/ngx-bootstrap";
import { ReferredByComponent } from "./referred-by/referred-by.component";
import { SourceComponent } from "./source/source.component";
import { CounsellorReportComponent } from "./counsellor-report/counsellor-report.component";
import { EnquiryHomeComponent } from './enquiry-home/enquiry-home.component';
import { EnquiryReportRoutingModule } from "./enquiry-report-routing.module";
import { EnquiryReportComponent } from "./enquiry-report.component";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        EnquiryReportRoutingModule

    ],
    exports:[

    ],
    declarations :[
        ReferredByComponent,
        SourceComponent,
        CounsellorReportComponent,
        EnquiryHomeComponent
    ]
})

export class EnquiryReportModule{

}