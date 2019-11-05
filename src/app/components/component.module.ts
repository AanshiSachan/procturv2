import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { ComponentRoutingModule } from './component-routing.module';
import { ComponentsComponent } from './components.component';
import { SharedModule } from '../components/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import { OverlayMenuComponent } from './overlay-menu/overlay-menu.component';
import { CoreHeaderComponent } from './core/core-header/core-header.component';
import { CoreSidednavComponent } from './core/core-sidednav/core-sidednav.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { GlobalSearchPopupComponent } from './global-search-popup/global-search-popup.component';
import { SearchBoxComponent } from './core/search-box/search-box.component';
import { CourseListService } from '../services/course-services/course-list.service';
import { SideBarComponent } from './core/side-bar/side-bar.component';
import { StudentFeeService } from './student-module/student_fee.service';

@NgModule({
    imports: [
        CommonModule,
        ComponentRoutingModule,
        BsDatepickerModule.forRoot(),
        SharedModule,
        FormsModule,
    ],
    declarations: [
        ComponentsComponent,
        CoreSidednavComponent,
        CoreHeaderComponent,
        OverlayMenuComponent,
        ChangePasswordComponent,
        ChangePasswordComponent,
        GlobalSearchPopupComponent,
        SearchBoxComponent,
        SideBarComponent
    ],
    entryComponents: [
    ],
    providers: [
        StudentFeeService,
        CourseListService
    ],
    exports: [
    ]
})
export class ComponentModule {

}
