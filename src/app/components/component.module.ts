import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { ComponentRoutingModule } from './component-routing.module';
import { ComponentsComponent } from './components.component';
import { SharedModule } from '../components/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OverlayMenuComponent } from './overlay-menu/overlay-menu.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SearchBoxComponent } from './core/search-box/search-box.component';
import { CourseListService } from '../services/course-services/course-list.service';
import { SideBarComponent } from './core/side-bar/side-bar.component';
import { StudentFeeService } from './student-module/student_fee.service';
import { TrainingVideoComponent } from './training-video/training-video.component';
import { TopToolbarComponent } from './core/top-toolbar/top-toolbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { ManageExpensesComponent } from './core/quick-manage-expenses/manage-expenses.component';
import { ExcelService } from '../services/excel.service';
@NgModule({
    imports: [
        CommonModule,
        ComponentRoutingModule,
        BsDatepickerModule.forRoot(),
        SharedModule,
        FormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatTabsModule

    ],
    declarations: [
        ComponentsComponent,
        OverlayMenuComponent,
        ChangePasswordComponent,
        SearchBoxComponent,
        SideBarComponent,
        TrainingVideoComponent,
        TopToolbarComponent,
        ManageExpensesComponent,
    ],
    entryComponents: [
    ],
    providers: [
        StudentFeeService,
        CourseListService,
        ExcelService
    ],
    exports: [
    ]
})
export class ComponentModule {

}
