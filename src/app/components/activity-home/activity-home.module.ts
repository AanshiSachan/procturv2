import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityHomeComponent } from './activity-home.component';
import { ActivityHomeRoutingModule } from "./activity-home-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from 'ngx-bootstrap-custome/datepicker';
import 'moment';
import 'hammerjs';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ActivityPtmService } from '../../services/activity-ptmservice/activity-ptm.service';
import { PtmManagementComponent } from './ptm-management/ptm-management.component';
import { RouterModule } from '@angular/router';
import { ArchivingComponent } from './archiving/archiving.component';
import { ArchivingModule } from './archiving/archiving.module';
import { ExamdeskCourseAssignmentComponent } from './examdesk-course-assignment/examdesk-course-assignment.component';
import { ExamDeskCourseAssignmentService } from '../../services/examdesk-service/examdeskcourseassignment.service';
import { LiveClassesComponent } from './live-classes/live-classes.component';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { LiveClasses } from '../../services/live-classes/live-class.service';
import { TooltipModule } from 'ngx-bootstrap-custome';
import { EcourseMappingComponent } from './ecourse-mapping/ecourse-mapping.component';
import { AddClassComponent } from './live-classes/add-class/add-class.component';
import { EditClassComponent } from './live-classes/edit-class/edit-class.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        ActivityHomeRoutingModule,
        BsDatepickerModule,
        SharedModule,
        ArchivingModule,
        StepsModule,
        TooltipModule.forRoot(),
        NgMultiSelectDropDownModule.forRoot()
    ],
    declarations: [
        ActivityHomeComponent,
        HomeComponent,
        PtmManagementComponent,
        ExamdeskCourseAssignmentComponent,
        LiveClassesComponent,
        EcourseMappingComponent,
        AddClassComponent,
        EditClassComponent
    ],
    entryComponents: [
    ],
    providers: [
        ActivityPtmService,
        ExamDeskCourseAssignmentService,
        MessageService,
        LiveClasses
    ]
})
export class ActivityHomeModule {

}
