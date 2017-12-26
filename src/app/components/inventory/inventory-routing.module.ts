import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InventoryComponent } from './inventory.component'
import { HomeComponent } from './inventory-home/inventory-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: InventoryComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        component: HomeComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class InventoryRoutingModule {
}