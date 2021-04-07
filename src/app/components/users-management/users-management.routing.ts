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
                        loadChildren: () => import('app/components/users-management/users/users.module').then(m => m.UserModule)
                        // loadChildren: 'app/components/users-management/users/users.module#UserModule'
                    },
                    {
                        path: 'role',
                        loadChildren: () => import('app/components/users-management/role-management/role-management.module').then(m => m.RoleManagementModule)
                        // loadChildren: 'app/components/users-management/role-management/role-management.module#RoleManagementModule'
                    },
                    {
                        path: 'attendance',
                        loadChildren: () => import('./attendance/attendance.module').then(m => m.AttendanceModule),
                        pathMatch: 'prefix'
                        // loadChildren: 'app/components/users-management/role-management/role-management.module#RoleManagementModule'
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