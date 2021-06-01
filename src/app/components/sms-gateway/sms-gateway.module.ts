import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsGatewayRoutingModule } from './sms-gateway-routing.module';
import { SmsConfigurationComponent } from './sms-configuration/sms-configuration.component';
import { SmsGatewayComponent } from './sms-gateway.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [SmsConfigurationComponent,
    SmsGatewayComponent],
  imports: [
    CommonModule,
    SmsGatewayRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SmsGatewayModule { }
