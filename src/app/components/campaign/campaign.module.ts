import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignComponent } from './campaign.component';
import { CampaignRoutingModule } from "./campaign-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultiselectDropdownModule } from '../../../assets/imported_modules/multiselect-dropdown';
import { BusyModule, BusyConfig } from '../../../assets/imported_modules/angular2-busy/build';
import { NgLoggerModule, Level } from '@nsalaun/ng-logger';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import 'moment';
import 'hammerjs';
import { CampaignHomeComponent } from './campaign-home/campaign-home.component';
import { CampaignAddComponent } from './campaign-add/campaign-add.component';
import { CampaignBulkComponent } from './campaign-bulk/campaign-bulk.component';
import { CampaignPopUpComponent } from './campaign-pop-up/campaign-pop-up.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MultiselectDropdownModule,
        BusyModule,
        NgLoggerModule.forRoot(Level.LOG),
        CommonModule,
        CampaignRoutingModule,
        BsDatepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule
    ],
    declarations: [
        CampaignComponent,
        CampaignHomeComponent,
        CampaignAddComponent,
        CampaignBulkComponent,
        CampaignPopUpComponent
    ], 
    entryComponents: [        
    ],
    providers: [
    ]
})
export class CampaignModule {

}