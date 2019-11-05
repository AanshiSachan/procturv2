import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LeadsComponent } from './leads.component'
import { LeadsHomeComponent } from './leads-home/leads-home.component';
import { EnquiryAddComponent } from './enquiry-add/enquiry-add.component';
import { DataSetupComponent } from './data-setup/data-setup.component';


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
                  loadChildren: 'app/components/leads/campaign/campaign.module#CampaignModule',
                  pathMatch: 'prefix'
              },
              {
                  path: 'add',
                  component: EnquiryAddComponent,
                  pathMatch: 'prefix'
              },
              {
                  path: 'enquiry',
                  loadChildren: 'app/components/leads/enquiry/enquiry.module#EnquiryModule',
                  pathMatch: 'prefix'
              },
              {
                  path: 'enquiryReport',
                  loadChildren: 'app/components/leads/enquiry-report/enquiry-report.module#EnquiryReportModule',
                  pathMatch: 'prefix'
              },
              {
                  path: 'setup',
                  component: DataSetupComponent,
                  pathMatch: 'prefix'
              }
          ]
      }
  ]
)],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
