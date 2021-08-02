import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeeUpdateComponent } from './fee-update.component';
import { UpdateComponent } from './update/update.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
        path: '',
        component: FeeUpdateComponent,
        children:[
          {
            path:'',
            component: UpdateComponent
          },
          {
            path: 'view-fee/:std_id',
            component: ViewComponent
          }
        ]
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeeUpdateRoutingModule { }
