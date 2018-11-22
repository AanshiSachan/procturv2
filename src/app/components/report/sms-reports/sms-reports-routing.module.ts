import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsReportsComponent } from './sms-reports.component';
import { TransctionalSmsComponent } from './transctional-sms/transctional-sms.component';
import { CompaignSmsComponent } from './compaign-sms/compaign-sms.component';
import { SmsHomeComponent } from './sms-home/sms-home.component';

const routes: Routes = [{
  path: '',
  component: SmsReportsComponent,
  pathMatch: 'prefix',
  children: [
    {
      path: '',
      component: SmsHomeComponent
    },
    {
      path: 'compaign',
      component: CompaignSmsComponent
    },
    {
      path: 'transaction',
      component: TransctionalSmsComponent
    },

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsReportsRoutingModule { }
