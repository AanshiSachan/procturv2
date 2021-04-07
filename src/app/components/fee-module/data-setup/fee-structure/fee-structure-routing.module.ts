import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeeStructureAddEditComponent } from './fee-structure-add-edit/fee-structure-add-edit.component';
import { FeeStructureHomeComponent } from './fee-structure-home/fee-structure-home.component';
import { FeeStructureComponent } from './fee-structure.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: FeeStructureComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        redirectTo: 'home'
                    },
                    {
                        path: 'home',
                        component: FeeStructureHomeComponent
                    },
                    {
                        path: 'add',
                        component: FeeStructureAddEditComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class FeeStructureRoutingModule {
}