import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent, ProductListComponent, SalesReportsComponent,
    OfferHistoryComponent } from '.';
import { ProductCreationComponent } from './product-creation/product-creation.component';
import { RegisteredStudentComponent } from './product-registered-student/product-registered-student.component';



const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'details',
        component: ProductListComponent,
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
    },
    {
        path: 'registered-user',
        component: RegisteredStudentComponent
    },
    {
        path: 'manage-offers',
        loadChildren: 'app/components/eStore-module/manage-coupon-home/manage-coupon-home.module#ManageCouponHomeModule',
        pathMatch: 'prefix'
    },
    {
        path: 'offer-history',
        component: OfferHistoryComponent,
        pathMatch: 'prefix'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EstoreRoutingModule { }
