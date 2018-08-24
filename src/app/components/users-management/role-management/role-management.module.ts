import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../shared/shared.module';
import { RoleManagementComponent } from './role-management.component';
import { RoleManagementRouting } from './role-management.routing';
import { RoleService } from '../../../services/user-management/role.service';
import { AddEditRoleComponent } from './add-edit-role/add-edit-role.component';
import { PickListModule } from 'primeng/primeng';

@NgModule({
    declarations: [
        RoleManagementComponent,
        AddEditRoleComponent
    ],
    exports: [],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        SharedModule,
        RoleManagementRouting,
        PickListModule
    ],
    providers: [
        RoleService
    ]
})

export class RoleManagementModule {

}