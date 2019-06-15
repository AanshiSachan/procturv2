import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransactionalComponent } from './transactional/transactional.component';
import { AllocateSmsComponent } from './allocate-sms.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AllocateSmsComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: 'sms-details',
                        component: TransactionalComponent,
                        pathMatch: 'prefix'
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AllocateSmsRoutingModule {
}