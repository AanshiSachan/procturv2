import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { SliderComponent } from './slider.component';


const routes: Routes = [
  {
      path: '',
      component: SliderComponent,
      pathMatch: 'prefix',
      children: [
          {
            path: 'slider',
            component: SliderComponent
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
export class SliderRoutingModule { }
