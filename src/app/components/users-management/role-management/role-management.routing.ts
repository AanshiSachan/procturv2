import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoleManagementComponent } from './role-management.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: RoleManagementComponent,
                pathMatch: 'prefix',
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class RoleManagementRouting {

}