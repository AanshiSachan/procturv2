import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ListComponent } from './list/list.component';
import { StaticPagesComponent } from './static-pages.component';


const routes: Routes = [
  {
      path: '',
      component: StaticPagesComponent,
      pathMatch: 'prefix',
      children: [
          {
            path: 'static-pages',
            component: StaticPagesComponent
          },
          {
            path: 'list',
            component: ListComponent
          },
          {
            path: 'add',
            component: AddEditComponent
          },
          {
            path: 'edit/:id',
            component: AddEditComponent
          }
          // {
          //   path: 'images',
          //   component: ImagesComponent
          // },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaticPagesRoutingModule { }
