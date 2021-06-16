import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditHourlyComponent } from './add-edit-hourly/add-edit-hourly.component';
import { AddEditSalaryComponent } from './add-edit-salary/add-edit-salary.component';
import { HourlyTemplateComponent } from './hourly-template/hourly-template.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { ManageSalaryComponent } from './manage-salary/manage-salary.component';
import { SalaryTemplateComponent } from './salary-template/salary-template.component';
import { ViewManageTemplateComponent } from './view-manage-template/view-manage-template.component';
import { ViewSalaryTemplateComponent } from './view-salary-template/view-salary-template.component';
import { AddEditManageComponent } from './add-edit-manage/add-edit-manage.component';
import { AddSalaryPaymentComponent } from './add-salary-payment/add-salary-payment.component';
import { ViewSalaryPaymentComponent } from './view-salary-payment/view-salary-payment.component';



const routes: Routes = [
  {path :'salary-template',component:SalaryTemplateComponent},
  {path :'hourly-template',component:HourlyTemplateComponent},
  {path :'make-payment',component:MakePaymentComponent},
  {path :'manage-salary',component:ManageSalaryComponent},
  {path :'add-salary',component:AddEditSalaryComponent,pathMatch: 'prefix'},
  {path :'edit-salary/:id',component:AddEditSalaryComponent,pathMatch: 'prefix'},
  {path :'view-salary-template/:id',component:ViewSalaryTemplateComponent},
  {path :'add-hourly',component:AddEditHourlyComponent},
  {path :'edit-hourly/:id',component:AddEditHourlyComponent,pathMatch:'prefix'},
  {path :'view-manage-template/:teacher_id/:user_id',component:ViewManageTemplateComponent},
  {path :'add-manage/:teacher_id/:user_id',component:AddEditManageComponent},
  {path :'edit-manage/:teacher_id/:user_id',component:AddEditManageComponent},
  {path :'add-salary-payment/:teacher_id/:user_id',component:AddSalaryPaymentComponent},
  {path :'view-salary-payment/:teacher_id/:user_id',component:ViewSalaryPaymentComponent},












];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayroleRoutingModule { }
