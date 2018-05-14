import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersManagementComponent } from './users-management.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: UsersManagementComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        redirectTo: 'user'
                    },
                    {
                        path: 'user',
                        loadChildren: 'app/components/users-management/users/users.module#UserModule'
                    },
                    {
                        path: 'role',
                        loadChildren: 'app/components/users-management/role-management/role-management.module#RoleManagementModule'
                    },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class UserManagementRouting {

}