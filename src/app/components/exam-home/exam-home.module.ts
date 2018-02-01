import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamHomeComponent } from './exam-home.component';
import { ExamHomeRoutingModule } from "./exam-home-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultiselectDropdownModule } from '../../../assets/imported_modules/multiselect-dropdown';
import { BusyModule, BusyConfig } from '../../../assets/imported_modules/angular2-busy/build';
import { NgLoggerModule, Level } from '@nsalaun/ng-logger';
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
        MultiselectDropdownModule,
        BusyModule,
        NgLoggerModule.forRoot(Level.LOG),
        CommonModule,
        ExamHomeRoutingModule,
        BsDatepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule,
        SharedModule
    ],
    declarations: [
        ExamHomeComponent,
        HomeComponent
    ], 
    entryComponents: [        
    ],
    providers: [  
    ]
})
export class ExamHomeModule {

}