import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeeTemplateHomeComponent } from './fee-template.component';
import { TemplateHomeComponent } from './template-home/template-home.component';

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