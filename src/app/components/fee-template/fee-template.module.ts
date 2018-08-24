import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeTemplateRoutingModule } from "./fee-template-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import { FeeTemplateHomeComponent } from './fee-template.component'
import 'moment';
import 'hammerjs';
import { FeeStrucService } from '../../services/feeStruc.service';
//import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { TemplatePopUpComponent } from './template-popup/template-popup.component';
import { TemplateHomeComponent } from './template-home/template-home.component';
import { FeeTypesComponent } from './fee-types/fee-types.component';
import { FeeTemplateAddComponent } from './fee-template-add/fee-template-add.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
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
        FeeTypesComponent,
        TemplatePopUpComponent,
        FeeTemplateAddComponent
    ],
    entryComponents: [
    ],
    providers: [
        FeeStrucService
    ]
})
export class FeeTemplateModule {

}