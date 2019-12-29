import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignReportsRoutingModule } from './campaign-reports-routing.module';
import { CampaignSmsComponent } from './campaign-sms/campaign-sms.component';
import { CampaignBaseReportComponent } from './campaign-base-report/campaign-base-report.component';
import { CampaignLeadSmsComponent } from './campaign-lead-sms/campaign-lead-sms.component';
import { CampaignReportsComponent } from './campaign-reports.component';
import { SharedModule } from '../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap-custome';
import { CampaignReportsHomeComponent } from './campaign-reports-home/campaign-reports-home.component';

import { getSMSService } from '../../../services/report-services/get-sms.service';
import { ExcelService } from '../../../services/excel.service';


@NgModule({
  imports: [
    CommonModule,
    CampaignReportsRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
  declarations: [
    CampaignSmsComponent,
    CampaignReportsComponent,
    CampaignBaseReportComponent,
    CampaignLeadSmsComponent,
    CampaignReportsHomeComponent
  ],
  providers:[
    getSMSService,
    ExcelService,

  ]
})
export class CampaignReportsModule { }
