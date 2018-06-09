import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ChequeManageComponent } from './cheque-manage/cheque-manage.component';
import { FeeManageComponent } from './fee-manage/fee-manage.component';

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
                    },
                    {
                        path: 'fee',
                        component: FeeManageComponent
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