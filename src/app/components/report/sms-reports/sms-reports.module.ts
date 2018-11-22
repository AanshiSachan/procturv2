import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap-custome';
import { SmsReportsRoutingModule } from './sms-reports-routing.module';
import { SmsReportsComponent } from './sms-reports.component';
import { TransctionalSmsComponent } from './transctional-sms/transctional-sms.component';
import { CompaignSmsComponent } from './compaign-sms/compaign-sms.component';
import { SmsHomeComponent } from './sms-home/sms-home.component';
import { FormsModule, ReactiveFormsModule } from '../../../../../node_modules/@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SmsReportsRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
  declarations: [SmsReportsComponent, TransctionalSmsComponent, CompaignSmsComponent, SmsHomeComponent]
})
export class SmsReportsModule { }
