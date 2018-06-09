import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FAQHomeComponent } from './faq-home/faq-home.component'
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
                        path: '',
                        redirectTo: 'home'
                    },
                    {
                        path: 'home',
                        component: FAQHomeComponent
                    }
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