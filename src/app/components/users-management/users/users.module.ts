import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './users.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../shared/shared.module';
import { UserRouting } from './users.routing';
import { UserService } from '../../../services/user-management/user.service';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';


@NgModule({
    declarations: [
        UsersComponent,
        AddEditUserComponent,
    ],
    exports: [],
    imports: [
        BsDatepickerModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        UserRouting
    ],
    providers: [
        UserService
    ]
})

export class UserModule {

}