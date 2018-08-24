import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { ComponentRoutingModule } from './component-routing.module';
import { ComponentsComponent } from './components.component';
import { SharedModule } from '../components/shared/shared.module';
import { BsDatepickerModule } from '../../assets/imported_modules/ngx-bootstrap/datepicker';
import { OverlayMenuComponent } from './overlay-menu/overlay-menu.component';
import { CoreHeaderComponent } from './core/core-header/core-header.component';
import { CoreSidednavComponent } from './core/core-sidednav/core-sidednav.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EnquiryUpdatePopupComponent } from './enquiry-update-popup/enquiry-update-popup.component';
import { GlobalSearchPopupComponent } from './global-search-popup/global-search-popup.component';
import { SearchBoxComponent } from './core/search-box/search-box.component';
import { EnquiryModule } from './enquiry/enquiry.module';

@NgModule({
    imports: [
        CommonModule,
        ComponentRoutingModule,
        BsDatepickerModule.forRoot(),
        SharedModule,
        FormsModule,
        EnquiryModule
    ],
    declarations: [
        ComponentsComponent,
        CoreSidednavComponent,
        CoreHeaderComponent,
        OverlayMenuComponent,
        ChangePasswordComponent,
        ChangePasswordComponent,
        EnquiryUpdatePopupComponent,
        GlobalSearchPopupComponent,
        SearchBoxComponent
    ],
    entryComponents: [
    ],
    providers: [

    ],
    exports: [
    ]
})
export class ComponentModule {

}
