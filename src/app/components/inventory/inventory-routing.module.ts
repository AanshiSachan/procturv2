import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InventoryComponent } from './inventory.component'
import { HomeComponent } from './inventory-home/inventory-home.component';
import { InventoryCategoryComponent } from './inventory-category/inventory-category.component';

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
                        redirectTo:'item'
                    },
                    {
                        path: 'item',
                        component: HomeComponent
                    },                   
                    {
                        path: 'category',
                        component: InventoryCategoryComponent
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