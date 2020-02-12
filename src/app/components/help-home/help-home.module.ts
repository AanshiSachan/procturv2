import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import 'hammerjs';
import 'moment';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { FileUploadModule, MenuModule, SplitButtonModule } from 'primeng/primeng';
import { SharedModule } from '../shared/shared.module';
import { HelpHomeRoutingModule } from "./help-home-routing.module";
import { HelpHomeComponent } from './help-home.component';
//import { HomeComponent } from './home/home.component';
@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        HelpHomeRoutingModule,
        BsDatepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule,
       
        SharedModule
    ],
    declarations: [
        HelpHomeComponent
    ], 
    entryComponents: [        
    ],
    providers: [          
    ]
})
export class HelpHomeModule {

}