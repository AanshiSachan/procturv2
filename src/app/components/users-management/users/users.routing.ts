import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: UsersComponent,
                pathMatch: 'prefix',
            },
            {
                path: 'addedit',
                component: AddEditUserComponent
            },
            {
                path: 'addedit/:id',
                component: AddEditUserComponent
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})

export class UserRouting {

}