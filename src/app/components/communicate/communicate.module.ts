import { NgModule } from '@angular/core';
import { CommunicateComponent, PtmManagementComponent, ExamReportComponent, FilterPipe, EmailReportComponent, EventManagmentComponent } from '.';
import { SharedModule } from '../shared/shared.module';
import { CommunicateRoutingModule } from './communicate-routing.module';
import { CoummunicateHomeComponent } from './coummunicate-home/coummunicate-home.component';
import { ActivityPtmService } from '../../services/activity-ptmservice/activity-ptm.service';
import { ExcelService } from '../../services/excel.service';
import { ExportToPdfService } from '../../services/export-to-pdf.service';
import { ExamService } from '../../services/report-services/exam.service';
import { getEmailService } from '../../services/report-services/get-email.service';
import { getSMSService } from '../../services/report-services/get-sms.service';
import { postSMSService } from '../../services/report-services/post-sms.service';
import { EventManagmentService } from '../../services/event-managment.service';
import { HttpService } from '../../services/http.service';

@NgModule({
  imports: [
    SharedModule,
    CommunicateRoutingModule
  ],
  declarations: [
    CommunicateComponent,
    CoummunicateHomeComponent,
    PtmManagementComponent,
    ExamReportComponent,
    EmailReportComponent,
    EventManagmentComponent,
    FilterPipe
  ],
  exports: [
    FilterPipe
  ],
  providers:[
    getSMSService,
    postSMSService,
    ActivityPtmService,
    ExcelService,
    ExportToPdfService,
    ExamService,
    getEmailService,
    ActivityPtmService,
    EventManagmentService,
    HttpService
  ]
})
export class CommunicateModule { }
