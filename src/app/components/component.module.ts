import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { ComponentRoutingModule } from './component-routing.module';
import { ComponentsComponent } from './components.component';
import { SharedModule } from '../components/shared/shared.module';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { OverlayMenuComponent } from './overlay-menu/overlay-menu.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SearchBoxComponent } from './core/search-box/search-box.component';
import { CourseListService } from '../services/course-services/course-list.service';
import { SideBarComponent } from './core/side-bar/side-bar.component';
import { StudentFeeService } from './student-module/student_fee.service';
import { TrainingVideoComponent } from './training-video/training-video.component';

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
        OverlayMenuComponent,
        ChangePasswordComponent,
        SearchBoxComponent,
        SideBarComponent,
        TrainingVideoComponent,
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
