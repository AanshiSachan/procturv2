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
import { AddEditHourlyComponent } from './add-edit-hourly/add-edit-hourly.component';
import { ViewManageTemplateComponent } from './view-manage-template/view-manage-template.component';
import { AddEditManageComponent } from './add-edit-manage/add-edit-manage.component';
import { ViewSalaryPaymentComponent } from './view-salary-payment/view-salary-payment.component';
import { AddSalaryPaymentComponent } from './add-salary-payment/add-salary-payment.component';


@NgModule({
  declarations: [PayroleComponent, SalaryTemplateComponent, AddEditSalaryComponent, HourlyTemplateComponent, ManageSalaryComponent, MakePaymentComponent, ViewSalaryTemplateComponent, AddEditHourlyComponent, ViewManageTemplateComponent, AddEditManageComponent, ViewSalaryPaymentComponent, AddSalaryPaymentComponent],
  imports: [
    CommonModule,
    PayroleRoutingModule,
    FormsModule,
    SharedModule
  ],
  providers:[ExportToPdfService,ExcelService]
})
export class PayroleModule { }
