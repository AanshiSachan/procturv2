import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FAQHeadComponent } from './faq-head/faq-head.component';
import { FAQHomeComponent } from './faq-home/faq-home.component'
import { FAQSidenavComponent } from './faq-sidenav/faq-sidenav.component';
import { FAQComponent } from './faq.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: FAQComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: "",
                        redirectTo: 'home'
                    },
                    {
                        path: 'home',
                        component: FAQHomeComponent,
                    },
                    {
                        path: "",
                        component: FAQSidenavComponent,
                        outlet: "sidebar"
                    },
                    {
                        path: "",
                        component: FAQHeadComponent,
                        outlet: "header"
                    },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class FAQRoutingModule {

}