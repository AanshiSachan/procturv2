import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeeTemplateHomeComponent } from './fee-template.component';
import { TemplateHomeComponent } from './template-home/template-home.component';
import { FeeTypesComponent } from './fee-types/fee-types.component';

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
                        path: 'fee-type',
                        component: FeeTypesComponent
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