import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { PayroleRoutingModule } from './payrole-routing.module';
import { PayroleComponent } from './payrole/payrole.component';
import { SalaryTemplateComponent } from './salary-template/salary-template.component';
import { AddEditSalaryComponent } from './add-edit-salary/add-edit-salary.component';
import { HourlyTemplateComponent } from './hourly-template/hourly-template.component';
import { ManageSalaryComponent } from './manage-salary/manage-salary.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { ViewSalaryTemplateComponent } from './view-salary-template/view-salary-template.component';
import { ExportToPdfService } from './../../services/export-to-pdf.service';
import { ExcelService } from './../../services/excel.service';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [PayroleComponent, SalaryTemplateComponent, AddEditSalaryComponent, HourlyTemplateComponent, ManageSalaryComponent, MakePaymentComponent, ViewSalaryTemplateComponent],
  imports: [
    CommonModule,
    PayroleRoutingModule,
    FormsModule,
    SharedModule
  ],
  providers:[ExportToPdfService,ExcelService]
})
export class PayroleModule { }
