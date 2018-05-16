import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpHomeComponent } from './help-home.component';
import { HelpHomeRoutingModule } from "./help-home-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import 'moment';
import 'hammerjs';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
// import {ChatbotModule} from '../chatbot/chatbot.module';
// import {ZendAuth} from '../../services/Chat-bot/chatbot.service';
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
        HelpHomeComponent,
        HomeComponent
    ], 
    entryComponents: [        
    ],
    providers: [  
        // ZendAuth
        
    ]
})
export class HelpHomeModule {

}