import { NgModule } from '@angular/core';
import { ReportCardRouting } from './report-card.routing';
import { ReportCardComponent } from './report-card.component';
import { StudentReportService } from '../../../services/report-services/student-report-service/student-report.service';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewReportCardComponent } from './view-report-card/view-report-card.component';
import { BsDatepickerModule } from '../../../../assets/imported_modules/ngx-bootstrap';

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
        StudentReportService
    ]
})

export class ReportCardModule { }