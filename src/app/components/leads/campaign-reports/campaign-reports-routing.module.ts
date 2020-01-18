import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CampaignReportsComponent } from './campaign-reports.component';
import { CampaignSmsComponent } from './campaign-sms/campaign-sms.component';
import { CampaignBaseReportComponent } from './campaign-base-report/campaign-base-report.component';
import { CampaignLeadSmsComponent } from './campaign-lead-sms/campaign-lead-sms.component';
import { CampaignReportsHomeComponent } from './campaign-reports-home/campaign-reports-home.component';

const routes: Routes = [{
  path: '',
  component: CampaignReportsComponent,
  pathMatch: 'prefix',
  children: [
    {
      path: '',
      component: CampaignReportsHomeComponent
    },
    {
      path: 'sms-report',
      component: CampaignSmsComponent,
    },
    {
      path: 'sms-report/:id',
      component: CampaignBaseReportComponent,
    },
    {
      path: 'lead-sms',
      component: CampaignLeadSmsComponent
    },

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignReportsRoutingModule { }
