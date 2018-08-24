import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../shared/shared.module'

import { FAQRoutingModule } from './faq-routing.module';


import { FAQHomeComponent } from './faq-home/faq-home.component'
import { FAQComponent } from './faq.component';
import { FAQCardComponent } from './faq-card/faq-card.component';
import { FAQSidenavComponent } from './faq-sidenav/faq-sidenav.component';
import { FAQHeadComponent } from './faq-head/faq-head.component';

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
        FAQComponent,
        FAQSidenavComponent,
        FAQHeadComponent
    ],
    entryComponents: [
        FAQCardComponent,
        FAQSidenavComponent,
        FAQHeadComponent
    ],
    providers: [

    ]
})
export class FaqModule {

}