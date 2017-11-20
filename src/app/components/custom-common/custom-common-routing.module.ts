import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CustomCommonComponent } from './custom-common.component';
import { CreateCustomCompComponent } from './create-custom-comp/create-custom-comp.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: CustomCommonComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        component: CreateCustomCompComponent 
                    },
                    {
                        path: 'CustomComponent',
                        component: CreateCustomCompComponent,
                        pathMatch: 'prefix',
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CustomCommonRoutingModule {
}