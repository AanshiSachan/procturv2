import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentModuleRoutingModule } from './student-module-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import {BsDatepickerConfig, BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { FileUploadModule, MenuModule, SplitButtonModule } from 'primeng/primeng';;

import { AddStudentPrefillService } from '../../services/student-services/add-student-prefill.service';
import { WidgetService } from '../../services/widget.service';
import { FetchStudentService } from '../../services/student-services/fetch-student.service';
import { PostStudentDataService } from '../../services/student-services/post-student-data.service';
import {
  StudentModuleComponent, StudentHomeComponent, PartialPayHistoryComponent, StudentAddComponent,
  UserStudentComponent, StudentEditComponent, StudentBulkComponent, StudentSidebarComponent,
  StudentBatchListComponent, SortPipe, StudentFeeTableComponent, StudentDiscountComponent, RegisteredStudentsComponent,
  StudentsComponent, StudentsArchivedReportComponent, ViewReportCardComponent
} from '.';
import { SharedModule } from '../shared/shared.module';
import { UserService } from '../../services/user-management/user.service';
import { CoursesServiceService } from '../../services/archiving-service/courses-service.service';
import { StudentReportService } from '../../services/report-services/student-report-service/student-report.service';
import { ProductService } from '../../services/products.service';
import { HttpService } from '../../services/http.service';
import { ManageExamModule } from '../master/master.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { StudentAddNewComponent } from './student-add-new/student-add-new.component';
import { StudentEditNewComponent } from './student-edit-new/student-edit-new.component';
import { StudentHomev2Component } from './student-homev2/student-homev2.component';
import { ViewReportCardV2Component } from './view-report-card-v2/view-report-card-v2.component';
import { CertificatesComponent } from '../student-module/certificates/certificates.component';
import { CertificateReportComponent } from './certificate-report/certificate-report.component';
import { StudentAdditionalformFieldComponent } from './student-additionalform-field/student-additionalform-field.component';
import { CheckBoxConverterPipe } from '../custom-common/check-box-converter.pipe';


@NgModule({
  imports: [
    CommonModule,
    StudentModuleRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    // BsDatepickerModule,
    FileUploadModule,
    SplitButtonModule,
    MenuModule,
    ManageExamModule,
    EditorModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    StudentAddComponent,
    UserStudentComponent,
    StudentEditComponent,
    StudentBulkComponent,
    StudentSidebarComponent,
    StudentBatchListComponent,
    SortPipe,
    StudentFeeTableComponent,
    StudentDiscountComponent,
    PartialPayHistoryComponent,
    StudentHomeComponent,
    StudentModuleComponent,
    RegisteredStudentsComponent,
    StudentsComponent,
    StudentsArchivedReportComponent,
    ViewReportCardComponent,
    StudentAddNewComponent,
    StudentEditNewComponent,
    StudentHomev2Component,
    ViewReportCardV2Component,
    CertificatesComponent,
    CertificateReportComponent,
    StudentAdditionalformFieldComponent,
    CheckBoxConverterPipe
  ],
  providers: [
    AddStudentPrefillService,
    WidgetService,
    FetchStudentService,
    PostStudentDataService,
    UserService,
    CoursesServiceService,
    StudentReportService,
    ProductService,
    HttpService
  ],
  entryComponents: [
    UserStudentComponent,
    StudentFeeTableComponent,
    StudentDiscountComponent,
    StudentBatchListComponent,
    PartialPayHistoryComponent
  ]
})
export class StudentModule2 { }
