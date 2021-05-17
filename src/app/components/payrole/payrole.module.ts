import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayroleRoutingModule } from './payrole-routing.module';
import { PayroleComponent } from './payrole/payrole.component';
import { SalaryTemplateComponent } from './salary-template/salary-template.component';
import { AddEditSalaryComponent } from './add-edit-salary/add-edit-salary.component';
import { HourlyTemplateComponent } from './hourly-template/hourly-template.component';
import { ManageSalaryComponent } from './manage-salary/manage-salary.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';


@NgModule({
  declarations: [PayroleComponent, SalaryTemplateComponent, AddEditSalaryComponent, HourlyTemplateComponent, ManageSalaryComponent, MakePaymentComponent],
  imports: [
    CommonModule,
    PayroleRoutingModule
  ]
})
export class PayroleModule { }
