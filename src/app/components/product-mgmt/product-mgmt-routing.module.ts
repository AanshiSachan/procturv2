import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent, ProductListComponent, GroupComponent, SalesReportsComponent } from '.';
import { ProductCreationComponent } from './product-creation/product-creation.component';


const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'details',
        component: ProductListComponent,
    },
    {
        path: 'groups',
        component: GroupComponent
    },
    {
        path: 'sales-report',
        component: SalesReportsComponent
    },
    {
        path: 'create',
        component: ProductCreationComponent
    },
    {
        path: 'create/:entity_id',
        component: ProductCreationComponent
    },
    {
        path: 'create/:entity_id/:form',
        component: ProductCreationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductMgmtRoutingModule { }
