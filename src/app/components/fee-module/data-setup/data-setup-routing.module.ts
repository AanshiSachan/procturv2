import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataSetupComponent, DiscountReasonComponent, MenuComponent, FeeTypesComponent} from '.';
import { AuthGuard } from '../../../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DataSetupComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        component: DataSetupComponent,
        children:[
          {
            path:'',
            component:MenuComponent
          },
          {
            path: 'fee-template',
            loadChildren: 'app/components/fee-module/data-setup/fee-template/fee-template.module#FeeTemplateModule',
            canLoad: [AuthGuard]
          },
          {
            path: 'discount-reason',
            component: DiscountReasonComponent
          },
          {
            path: 'fee-type',
            component: FeeTypesComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataSetupRoutingModule { }
