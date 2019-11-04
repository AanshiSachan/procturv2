import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ChequeManageComponent } from './cheque-manage/cheque-manage.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ChequeManageComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        redirectTo: 'cheque'
                    },
                    {
                        path: 'cheque',
                        component: ChequeManageComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class FeeActivityRoutingModule {
}