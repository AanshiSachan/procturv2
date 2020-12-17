import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqRoutingModule } from './faq-routing.module';
import { FaqHomeComponent } from './faq-home/faq-home.component';
import { FaqQaComponent } from './faq-qa/faq-qa.component';


@NgModule({
  declarations: [FaqHomeComponent, FaqQaComponent],
  imports: [
    CommonModule,
    FaqRoutingModule
  ]
})
export class FaqModule { }
