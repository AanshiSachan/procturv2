import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { GroupComponent } from './group/group.component';
import { ProductCreationComponent } from './product-creation/product-creation.component';
import { HomeComponent } from './home/home.component';

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
        path: 'create',
        component: ProductCreationComponent
    },
    {
        path: 'create/:product_id',
        component: ProductCreationComponent
    },
    {
        path: 'create/:product_id/:form',
        component: ProductCreationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductMgmtRoutingModule { }
