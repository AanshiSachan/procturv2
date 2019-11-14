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
import { RouterModule } from '@angular/router';
import { ArchivingComponent } from './archiving/archiving.component';
import { ArchivingModule } from './archiving/archiving.module';
import { ExamdeskCourseAssignmentComponent } from './examdesk-course-assignment/examdesk-course-assignment.component';
import { ExamDeskCourseAssignmentService } from '../../services/examdesk-service/examdeskcourseassignment.service';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { LiveClasses } from '../../services/live-classes/live-class.service';
import { TooltipModule } from 'ngx-bootstrap-custome';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { timeTableService } from '../../services/TimeTable/timeTable.service';;
import { WidgetService } from '../../services/widget.service';
import { RegisteredStudentsComponent } from './registered-students/registered-students.component';
import { UserService } from '../../services/user-management/user.service';

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
        ExamdeskCourseAssignmentComponent,
        RegisteredStudentsComponent
    ],
    entryComponents: [        
    ],
    providers: [
        ActivityPtmService,
        ExamDeskCourseAssignmentService,
        MessageService,
        timeTableService,
        LiveClasses,
        WidgetService,
        UserService
    ]
})
export class ActivityHomeModule {

}
