import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LeadsComponent } from './leads.component'
import { LeadsHomeComponent } from './leads-home/leads-home.component';
import { EnquiryAddComponent } from './enquiry-add/enquiry-add.component';
import { DataSetupComponent } from './data-setup/data-setup.component';
import { ManageCampaignComponent } from './manage-campaign/manage-campaign.component';


@NgModule({
  imports: [RouterModule.forChild([
      {
          path: '',
          component: LeadsComponent,
          pathMatch: 'prefix',
          children: [
              {
                  path: '',
                  component: LeadsHomeComponent
              },
              {
                  path: 'home',
                  component: LeadsHomeComponent,
                  pathMatch: 'prefix'
              },
              {
                  path: 'campaign',
                  loadChildren: () => import('app/components/leads/campaign/campaign.module').then(m => m.CampaignModule),
                //   loadChildren: 'app/components/leads/campaign/campaign.module#CampaignModule',
                  pathMatch: 'prefix'
              },
              {
                  path: 'manage-campaign',
                  component: ManageCampaignComponent,
                  pathMatch: 'prefix'
              },
              {
                  path: 'add',
                  component: EnquiryAddComponent,
                  pathMatch: 'prefix'
              },
              {
                  path: 'enquiry',
                  loadChildren: () => import('app/components/leads/enquiry/enquiry.module').then(m => m.EnquiryModule),
                //   loadChildren: 'app/components/leads/enquiry/enquiry.module#EnquiryModule',
                  pathMatch: 'prefix'
              },
              {
                  path: 'enquiryReport',
                  loadChildren: () => import('app/components/leads/enquiry-report/enquiry-report.module').then(m => m.EnquiryReportModule),
                //   loadChildren: 'app/components/leads/enquiry-report/enquiry-report.module#EnquiryReportModule',
                  pathMatch: 'prefix'
              },
              {
                  path: 'setup',
                  component: DataSetupComponent,
                  pathMatch: 'prefix'
              },
              {
                  path: 'campaign-reports',
                  loadChildren: () => import('app/components/leads/campaign-reports/campaign-reports.module').then(m => m.CampaignReportsModule),
                //   loadChildren: 'app/components/leads/campaign-reports/campaign-reports.module#CampaignReportsModule',
                  pathMatch: 'prefix'
              },
          ]
      }
  ]
)],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
