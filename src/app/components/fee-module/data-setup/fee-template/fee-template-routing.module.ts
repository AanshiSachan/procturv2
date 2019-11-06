import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeeTemplateHomeComponent } from './fee-template.component';
import { TemplateHomeComponent } from './template-home/template-home.component';
import { FeeTemplateAddComponent } from './fee-template-add/fee-template-add.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: FeeTemplateHomeComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        redirectTo: 'home'
                    },
                    {
                        path: 'home',
                        component: TemplateHomeComponent
                    },
                    {
                        path: 'add',
                        component: FeeTemplateAddComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class FeeTemplateRoutingModule {
}