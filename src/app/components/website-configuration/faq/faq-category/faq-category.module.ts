import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqCategoryRoutingModule } from './faq-category-routing.module';
import { FaqCategoryComponent } from './faq-category.component';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [FaqCategoryComponent, ListComponent, AddEditComponent],
  imports: [
    CommonModule,
    FaqCategoryRoutingModule,
    SharedModule
  ]
})
export class FaqCategoryModule { }
