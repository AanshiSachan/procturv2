import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseHomeComponent } from './expense-home.component';
import { ExpenseHomeRoutingModule } from "./expense-home-routing.module";
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
        ExpenseHomeRoutingModule,
        BsDatepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule,
        SharedModule
    ],
    declarations: [
        ExpenseHomeComponent,
        HomeComponent
    ], 
    entryComponents: [        
    ],
    providers: [  
    ]
})
export class ExpenseHomeModule {

}