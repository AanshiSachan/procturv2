import { NgModule } from '@angular/core';
import { ReportCardRouting } from './report-card.routing';
import { ReportCardComponent } from './report-card.component';
import { StudentReportService } from '../../../services/report-services/student-report-service/student-report.service';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewReportCardComponent } from './view-report-card/view-report-card.component';
import { BsDatepickerModule } from 'ngx-bootstrap-custome';
import { HttpService } from '../../../services/http.service';
import { CommonServiceFactory } from '../../../services/common-service';


@NgModule({
    imports: [
        ReportCardRouting,
        SharedModule,
        CommonModule,
        FormsModule,
        BsDatepickerModule
    ],
    exports: [],
    declarations: [
        ReportCardComponent,
        ViewReportCardComponent
    ],
    providers: [
        StudentReportService,
        HttpService,
        CommonServiceFactory,
    ]
})

export class ReportCardModule { }
