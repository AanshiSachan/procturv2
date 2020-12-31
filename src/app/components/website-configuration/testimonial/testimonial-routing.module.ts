import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ListComponent } from './list/list.component';
import { TestimonialComponent } from './testimonial.component';


const routes: Routes = [
  {
      path: '',
      component: TestimonialComponent,
      pathMatch: 'prefix',
      children: [
          {
            path: 'testimonial',
            component: TestimonialComponent
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
export class TestimonialRoutingModule { }
