import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ClassRoomComponent} from './class-room.component';
import {classRoomRoutingModule} from "./class-room-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultiselectDropdownModule } from '../../../assets/imported_modules/multiselect-dropdown';
import { BusyModule, BusyConfig } from '../../../assets/imported_modules/angular2-busy/build';
import { NgLoggerModule, Level } from '@nsalaun/ng-logger';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import 'moment';
import 'hammerjs';
//import { CampaignHomeComponent } from './campaign-home/campaign-home.component';
//import { CampaignAddComponent } from './campaign-add/campaign-add.component';
//import { CampaignBulkComponent } from './campaign-bulk/campaign-bulk.component';
//import { CampaignPopUpComponent } from './campaign-pop-up/campaign-pop-up.component';
import { SharedModule } from '../shared/shared.module';
import { AddClassRoomComponent } from './src/app/components/class-room/add-class-room/add-class-room.component';
import { ClassRoomListComponent } from './src/app/components/class-room/class-room-list/class-room-list.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MultiselectDropdownModule,
        BusyModule,
        NgLoggerModule.forRoot(Level.LOG),
        CommonModule,
        classRoomRoutingModule,
        BsDatepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule,
        SharedModule
    ],
    declarations: [
        ClassRoomComponent,
        AddClassRoomComponent,
        ClassRoomListComponent,
        //CampaignHomeComponent,
        //CampaignAddComponent,
        //CampaignPopUpComponent,
        //CampaignBulkComponent
    ], 
    entryComponents: [        
    ],
    providers: [
    ]
})
export class classRoomModule {

}