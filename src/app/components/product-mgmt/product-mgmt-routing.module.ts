import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { GroupComponent } from './group/group.component';
import { ProductCreationComponent } from './product-creation/product-creation.component';
import { HomeComponent } from './home/home.component';
import { SalesReportclsComponent } from './sales-reportcls/sales-reportcls.component';

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
        component: SalesReportclsComponent
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
