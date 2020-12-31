import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqHomeComponent } from './faq-home/faq-home.component';
import { FaqComponent } from './faq.component';


const routes: Routes = [
  {
    path: '',
    component: FaqComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: 'faq',
        component: FaqComponent
      },
      {
        path: 'home',
        component: FaqHomeComponent
      },
      {
        path: 'category',
        loadChildren: () => import('../faq/faq-category/faq-category.module').then(m => m.FaqCategoryModule),
        pathMatch: 'prefix'
      },
      {
        path: 'qa',
        loadChildren: () => import('../faq/faq-qa/faq-qa.module').then(m => m.FaqQaModule),
        pathMatch: 'prefix'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqRoutingModule { }
