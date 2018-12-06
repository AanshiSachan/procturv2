import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestUserRoutingModule } from './guest-user-routing.module';
import { GuestUserComponent } from './guest-user.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule, FormsModule } from '../../../../node_modules/@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    GuestUserRoutingModule
  ],
  declarations: [GuestUserComponent, RegisterComponent]
})
export class GuestUserModule { }
