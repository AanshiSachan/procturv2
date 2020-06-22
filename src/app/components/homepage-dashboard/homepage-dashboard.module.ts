import { NgModule } from '@angular/core';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { CommonModule } from '@angular/common';
import { HomepageDashboardComponent } from './homepage-dashboard.component';
import { HomepageDashboardRoutingModule } from "./homepage-dashboard-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import 'moment';
import 'hammerjs';
import { ProcturWidgetComponent } from './proctur-widget/proctur-widget.component';
import { SharedModule } from '../shared/shared.module';
// import { HomeComponent } from './home/home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ChartModule } from 'angular-highcharts';
import { WidgetService } from '../../services/widget.service';
import { EnquiryWidgetComponent } from "./enquiry-widget/enquiry-widget.component";
import { GeneralWidgetComponent } from './general-widget/general-widget.component';
import { BiometricWidgetComponent } from './biometric-widget/biometric-widget.component';
import { BiometricStatusServiceService } from '../../services/biometric-status/biometric-status-service.service';
import { BsDatepickerModule } from 'ngx-bootstrap-custome';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ExcelService } from '../../services/excel.service';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance.component';
import { TopicListingService } from '../../services/course-services/topic-listing.service';
import { ExamMarkUpdateComponent } from './exam-mark-update/exam-mark-update.component';
import { BatchModelComponent } from './exam-mark-update/batch-model/batch-model.component';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpService } from '../../services/http.service';
import { FeeWidgetComponent } from './fee-widget/fee-widget.component';
import {VdocipherComponent} from  './vdocipher/vdocipher.component';
import { StudentBirthdayComponent } from './student-birthday/student-birthday.component';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
    imports: [
        TreeViewModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        HomepageDashboardRoutingModule,
        BsDatepickerModule,
        SharedModule,
        ChartModule,
        FileUploadModule ,
        EditorModule
        // MdFormFieldModule,
        // MdInputModule
    ],
    declarations: [
        HomepageDashboardComponent,
        // HomeComponent,
        AdminHomeComponent,
        ProcturWidgetComponent,
        EnquiryWidgetComponent,
        GeneralWidgetComponent,
        BiometricWidgetComponent,
        ToDoListComponent,
        ExpensesComponent,
        MarkAttendanceComponent,
        ExamMarkUpdateComponent,
        BatchModelComponent,
        FeeWidgetComponent,
        VdocipherComponent,
        StudentBirthdayComponent
    ],
    entryComponents: [
        ProcturWidgetComponent,
        EnquiryWidgetComponent,
        GeneralWidgetComponent
    ],
    providers: [
        WidgetService,
        ExcelService,
        TopicListingService,
        BiometricStatusServiceService,
        HttpService
    ]
})
export class HomepageDashboardModule {

}
