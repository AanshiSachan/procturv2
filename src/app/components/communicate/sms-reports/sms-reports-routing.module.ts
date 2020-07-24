import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsReportsComponent } from './sms-reports.component';
import { TransctionalSmsComponent } from './transctional-sms/transctional-sms.component';
import { SmsHomeComponent } from './sms-home/sms-home.component';

const routes: Routes = [{
  path: '',
  component: SmsReportsComponent,
  pathMatch: 'prefix',
  children: [
    {
      path: 'transaction',
      component: SmsHomeComponent
    },
    {
      path: '',
      component: TransctionalSmsComponent
    },

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsReportsRoutingModule { }
