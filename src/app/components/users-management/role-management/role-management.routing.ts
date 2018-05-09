import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoleManagementComponent } from './role-management.component';
import { AddEditRoleComponent } from './add-edit-role/add-edit-role.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: RoleManagementComponent,
                pathMatch: 'prefix',
            },
            {
                path: 'addedit',
                component: AddEditRoleComponent
            },
            {
                path: 'addedit/:id',
                component: AddEditRoleComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class RoleManagementRouting {

}