import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditComponent } from '../faq-qa/add-edit/add-edit.component';
import { ListComponent } from '../faq-qa/list/list.component';
import { FaqQaComponent } from './faq-qa.component';


const routes: Routes = [
  {
    path: '',
    component: FaqQaComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: 'QA',
        component: FaqQaComponent
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
export class FaqQaRoutingModule { }
