import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditSalaryComponent } from './add-edit-salary/add-edit-salary.component';
import { HourlyTemplateComponent } from './hourly-template/hourly-template.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { ManageSalaryComponent } from './manage-salary/manage-salary.component';
import { SalaryTemplateComponent } from './salary-template/salary-template.component';
import { ViewSalaryTemplateComponent } from './view-salary-template/view-salary-template.component';



const routes: Routes = [
  {path :'salary-template',component:SalaryTemplateComponent},
  {path :'hourly-template',component:HourlyTemplateComponent},
  {path :'make-payment',component:MakePaymentComponent},
  {path :'manage-salary',component:ManageSalaryComponent},
  {path :'add-salary',component:AddEditSalaryComponent,pathMatch: 'prefix'
},
  {path :'edit-salary/:id',component:AddEditSalaryComponent,pathMatch: 'prefix'
},

  {path :'view-salary-template/:id',component:ViewSalaryTemplateComponent}





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayroleRoutingModule { }
