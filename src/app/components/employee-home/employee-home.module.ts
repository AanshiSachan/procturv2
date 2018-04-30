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
        HomeComponent
    ], 
    entryComponents: [        
    ],
    providers: [  
    ]
})
export class EmployeeHomeModule {

}