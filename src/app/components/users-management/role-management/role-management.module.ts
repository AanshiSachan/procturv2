import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from '../../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { SharedModule } from '../../shared/shared.module';
import { RoleManagementComponent } from './role-management.component';
import { RoleManagementRouting } from './role-management.routing';

@NgModule({
    declarations: [
        RoleManagementComponent
    ],
    exports: [],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BsDatepickerModule,
        SharedModule,
        RoleManagementRouting
    ],
    providers: []
})

export class RoleManagementModule {

}