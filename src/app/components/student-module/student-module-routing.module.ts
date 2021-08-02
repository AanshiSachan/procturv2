import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  StudentModuleComponent, StudentHomeComponent, StudentAddComponent, StudentBulkComponent,
  StudentEditComponent, RegisteredStudentsComponent, StudentsComponent, StudentsArchivedReportComponent, ViewReportCardComponent
} from '.';
import { CertificatesComponent } from './certificates/certificates.component';
import { StudentAddNewComponent } from './student-add-new/student-add-new.component';
import { StudentEditNewComponent } from './student-edit-new/student-edit-new.component';
import { StudentHomev2Component } from './student-homev2/student-homev2.component';
import { ViewReportCardV2Component } from './view-report-card-v2/view-report-card-v2.component';
import { StudentAdditionalformFieldComponent } from './student-additionalform-field/student-additionalform-field.component';
import { CertificateReportComponent } from './certificate-report/certificate-report.component';


const routes: Routes = [
  {
    path: '',
    component: StudentModuleComponent,
    children: [
      {
        path: '',
        //component: StudentHomeComponent,
        component:StudentHomev2Component,
        pathMatch: 'prefix',
      },
      {
        path: 'home',
        component: StudentHomeComponent,
        pathMatch: 'prefix',
      },
      {
        path: 'add',
        component: StudentAddNewComponent,
        pathMatch: 'prefix',
      },
      {
        path: 'edit/:id',
        component: StudentEditNewComponent,
        pathMatch: 'prefix',
      },
      {
        path: 'bulk',
        component: StudentBulkComponent,
        pathMatch: 'prefix',
      },
      {
        path: 'openUser',
        component: RegisteredStudentsComponent,
        pathMatch: 'prefix',
      },
      {
        path: 'archived_student',
        component: StudentsComponent,
        pathMatch: 'prefix',
      },
      {
        path: 'archived_status',
        component: StudentsArchivedReportComponent,
        pathMatch: 'prefix',
      },
      {
        path: 'reportcardV2/:id',
        
       component:ViewReportCardV2Component,
        pathMatch: 'prefix',
      }, 
      {
        path: 'reportcard/:id',
         component: ViewReportCardComponent,
        pathMatch: 'prefix',
      }, 
      {
        path: 'addNew',
        component: StudentAddComponent,
        pathMatch: 'prefix',
      },
      {
        path: 'certificates',
        component: CertificatesComponent,
         pathMatch: 'prefix',
      },
      {
        path: 'certificate-report',
        component: CertificateReportComponent,
      },
      {
        path: 'student-additionalform-field',
        component: StudentAdditionalformFieldComponent,
        pathMatch: 'prefix',
      }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentModuleRoutingModule { }
