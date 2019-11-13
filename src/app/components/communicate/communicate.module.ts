import { NgModule } from '@angular/core';
import { CommunicateComponent } from '.';
import { SharedModule } from '../shared/shared.module';
import { CommunicateRoutingModule } from './communicate-routing.module';


@NgModule({
  imports: [
    SharedModule,
    CommunicateRoutingModule
  ],
  declarations: [CommunicateComponent]
})
export class CommunicateModule { }
