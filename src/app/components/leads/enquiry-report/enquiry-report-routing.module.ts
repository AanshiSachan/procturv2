// import { ReportComponent } from "../report.component";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
// import { ReportHomeComponent } from "../report-home/report-home.component";
import { CounsellorReportComponent } from "./counsellor-report/counsellor-report.component";
import { SourceComponent } from "./source/source.component";
import { ReferredByComponent } from "./referred-by/referred-by.component";
import { EnquiryReportComponent } from "./enquiry-report.component";
import { EnquiryHomeComponent } from "./enquiry-home/enquiry-home.component";


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: EnquiryReportComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        component: EnquiryHomeComponent
                    },
                    {
                        path: 'home',
                        component: EnquiryHomeComponent
                    },
                    {
                        path: 'counsellor',
                        component: CounsellorReportComponent
                    },
                    {
                        path: 'source',
                        component: SourceComponent
                    },
                    {
                        path: 'referredBy' ,
                        component : ReferredByComponent
                    }


                ]
                }
            ])
        ],
        exports: [
            RouterModule
        ]
    })

    export class EnquiryReportRoutingModule {
    }
