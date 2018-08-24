import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UsersManagementComponent } from './users-management.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../shared/shared.module';
import { UserManagementRouting } from './users-management.routing';

@NgModule({
    declarations: [
        UsersManagementComponent,
    ],
    exports: [],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        SharedModule,
        UserManagementRouting
    ],
    providers: []
})

export class UserManagementModule {

}