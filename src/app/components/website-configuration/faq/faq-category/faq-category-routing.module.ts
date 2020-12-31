import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditComponent } from './add-edit/add-edit.component';
import { FaqCategoryComponent } from './faq-category.component';
import { ListComponent } from './list/list.component';


const routes: Routes = [
  {
    path: '',
    component: FaqCategoryComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: 'category',
        component: FaqCategoryComponent
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqCategoryRoutingModule { }
