import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeTemplateRoutingModule } from "./fee-template-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultiselectDropdownModule } from '../../../assets/imported_modules/multiselect-dropdown';
import { BusyModule, BusyConfig } from '../../../assets/imported_modules/angular2-busy/build';
import { NgLoggerModule, Level } from '@nsalaun/ng-logger';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { FeeTemplateHomeComponent } from './fee-template.component'
import 'moment';
import 'hammerjs';
import { FeeStrucService } from '../../services/feeStruc.service';
//import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { TemplateHomeComponent } from './template-home/template-home.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MultiselectDropdownModule,
        BusyModule,
        NgLoggerModule.forRoot(Level.LOG),
        CommonModule,
        FeeTemplateRoutingModule,
        BsDatepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule,
        SharedModule
    ],
    declarations: [
        FeeTemplateHomeComponent,
        TemplateHomeComponent,
    ],
    entryComponents: [
    ],
    providers: [
        FeeStrucService
    ]
})
export class FeeTemplateModule {

}