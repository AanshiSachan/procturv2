import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataSetupComponent, DiscountReasonComponent, MenuComponent, FeeTypesComponent} from '.';
import { AuthGuard } from '../../../guards/auth.guard';
import { FeeTypesV2Component } from './fee-types-v2/fee-types-v2.component';

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
            loadChildren: () => import('app/components/fee-module/data-setup/fee-template/fee-template.module').then(m => m.FeeTemplateModule),
            // loadChildren: 'app/components/fee-module/data-setup/fee-template/fee-template.module#FeeTemplateModule',
            canLoad: [AuthGuard]
          },
          {
            path: 'discount-reason',
            component: DiscountReasonComponent
          },
          {
            path: 'fee-type',
            component: FeeTypesComponent
          },{
            path: 'fee-type-v2',
            component: FeeTypesV2Component
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
