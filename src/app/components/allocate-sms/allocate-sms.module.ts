import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionalComponent } from './transactional/transactional.component';
import { AllocateSmsComponent } from './allocate-sms.component';
import { AllocateSmsRoutingModule } from './allocate-sms-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AllocateSmsRoutingModule

  ],
  declarations: [
    TransactionalComponent,
    AllocateSmsComponent
    ]
})
export class AllocateSmsModule { }
