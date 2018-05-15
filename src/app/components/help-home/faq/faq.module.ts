import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from '../../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { SharedModule } from '../../shared/shared.module'

import { FAQRoutingModule } from './faq-routing.module';

import { FAQHomeComponent } from './faq-home/faq-home.component'
import { FAQComponent } from './faq.component';
import { FAQCardComponent } from './faq-card/faq-card.component';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        SharedModule,
        FAQRoutingModule
    ],
    exports: [],
    declarations: [
        FAQHomeComponent,
        FAQCardComponent,
        FAQComponent
    ],
    entryComponents: [
        FAQCardComponent
    ],
    providers: [

    ]
})
export class FaqModule {

}