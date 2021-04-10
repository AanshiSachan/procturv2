import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryModuleComponent } from './inventory-module.component';
import{SupplierComponent} from './supplier/supplier.component';
import{ItemCmComponent} from './item-cm/item-cm.component';
import{PurchaseItemComponent} from './purchase-item/purchase-item.component';
import{PurchaseAddComponent} from './purchase-add/purchase-add.component';
import{PurchaseViewComponent} from './purchase-view/purchase-view.component';
import{SaleItemComponent} from './sale-item/sale-item.component';
import{SaleAddComponent} from './sale-add/sale-add.component';
import{SaleViewComponent} from './sale-view/sale-view.component';



const routes: Routes = [];

@NgModule({
    imports: [RouterModule.forChild([
    {
        path: '',
        component: InventoryModuleComponent,
        pathMatch: 'prefix',
        children: [
            {
                path: '',
                redirectTo:'item'
            },
            {
                path: 'supplier',
                component:SupplierComponent
            },
            {
                path: 'item-cm',
                component:ItemCmComponent
            },
            {
                path: 'purchase-item',
                component:PurchaseItemComponent
            },
            {
                path: 'purchase-add',
                component:PurchaseAddComponent
            },
            {
                path: 'edit/:id',
                component:PurchaseAddComponent
            },
            {
                path: 'purchase-view',
                component:PurchaseViewComponent
            },
            {
                path: 'sale-item',
                component:SaleItemComponent
            },
            {
                path: 'sale-add',
                component:SaleAddComponent
            },
            {
                path: 'sale-view',
                component:SaleViewComponent
            },
           
            {
                path: 'editSale/:id',
                component:SaleAddComponent
            },
            
    
        ]
    }
]
)],
  exports: [RouterModule]
})
export class InventoryModuleRoutingModule { }
