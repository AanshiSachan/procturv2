import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageDashboardComponent } from './homepage-dashboard.component';
import { HomepageDashboardRoutingModule } from "./homepage-dashboard-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultiselectDropdownModule } from '../../../assets/imported_modules/multiselect-dropdown';
import { BusyModule, BusyConfig } from '../../../assets/imported_modules/angular2-busy/build';
import { NgLoggerModule, Level } from '@nsalaun/ng-logger';
import { BsDatepickerModule } from '../../../assets/imported_modules/ngx-bootstrap/datepicker';
import { FileUploadModule, SplitButtonModule, MenuModule, MenuItem } from 'primeng/primeng';
import 'moment';
import 'hammerjs';
import { ProcturWidgetComponent } from './proctur-widget/proctur-widget.component';
//import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MultiselectDropdownModule,
        BusyModule,
        NgLoggerModule.forRoot(Level.LOG),
        CommonModule,
        HomepageDashboardRoutingModule,
        BsDatepickerModule,
        FileUploadModule,
        SplitButtonModule,
        MenuModule,
        SharedModule
    ],
    declarations: [
        HomepageDashboardComponent,
        HomeComponent,
        AdminHomeComponent,
        ProcturWidgetComponent
    ],
    entryComponents: [
        ProcturWidgetComponent
    ],
    providers: [
    ]
})
export class HomepageDashboardModule {

}