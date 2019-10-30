import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent, ProductListComponent, SalesReportsComponent,EcourseMappingComponent } from '.';
import { ProductCreationComponent } from './product-creation/product-creation.component';
import { RegisteredStudentComponent } from './product-registered-student/product-registered-student.component';


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
        path: 'ecoursemapping',
        component: EcourseMappingComponent,
        pathMatch: 'prefix'
    },
    {
        path: 'ecourse-file-manager',
        loadChildren: 'app/components/product-mgmt/ecourse-file-manager/ecourse-file-manager.module#EcourseFileManagerModule',
        pathMatch: "prefix"
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductMgmtRoutingModule { }
