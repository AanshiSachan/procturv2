import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqQaRoutingModule } from './faq-qa-routing.module';
import { ListComponent } from './list/list.component';
import { AddEditComponent } from './add-edit/add-edit.component';
import { SharedModule } from '../../../../components/shared/shared.module';


@NgModule({
  declarations: [ListComponent, AddEditComponent],
  imports: [
    CommonModule,
    FaqQaRoutingModule,
    SharedModule
  ]
})
export class FaqQaModule { }
