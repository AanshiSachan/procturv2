import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeHomeComponent } from './employee-home.component';
import { EmployeeHomeRoutingModule } from "./employee-home-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import 'moment';
import 'hammerjs';

//import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { EmployeeService } from '../../services/employee-service/employee.service';
import { AddEditEmployeeComponent } from './home/add-edit-employee/add-edit-employee.component';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        EmployeeHomeRoutingModule,
        BsDatepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule,
        SharedModule
    ],
    declarations: [
        EmployeeHomeComponent,
        HomeComponent,
        AddEditEmployeeComponent
    ],
    entryComponents: [
    ],
    providers: [
        EmployeeService
    ]
})
export class EmployeeHomeModule {

}