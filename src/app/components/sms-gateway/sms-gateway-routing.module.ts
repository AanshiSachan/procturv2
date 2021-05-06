import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsConfigurationComponent } from './sms-configuration/sms-configuration.component';
import { SmsGatewayComponent } from './sms-gateway.component';


const routes: Routes = [
  {
    path: '',
        component: SmsGatewayComponent,
        children: [
            {
                path: 'sms-configuration',
                component: SmsConfigurationComponent
            },
          ]
        }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsGatewayRoutingModule { }
