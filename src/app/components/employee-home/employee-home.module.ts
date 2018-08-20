import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeHomeComponent } from './employee-home.component';
import { EmployeeHomeRoutingModule } from "./employee-home-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { SplitButtonModule } from 'primeng/primeng';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { EmployeeService } from '../../services/employee-service/employee.service';
import { AddEditEmployeeComponent } from './home/add-edit-employee/add-edit-employee.component';
import { EmployeeSidenavComponent } from './employee-sidenav/employee-sidenav.component';
import { IntegerInputDirective } from './intergerOnly.directive';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        EmployeeHomeRoutingModule,
        BsDatepickerModule,
        SplitButtonModule,
        SharedModule,
        SplitButtonModule,
    ],
    declarations: [
        EmployeeHomeComponent,
        HomeComponent,
        AddEditEmployeeComponent,
        EmployeeSidenavComponent,
        IntegerInputDirective
    ],
    entryComponents: [
    ],
    providers: [
        EmployeeService
    ],
    exports: [
        IntegerInputDirective
    ]
})
export class EmployeeHomeModule {

}