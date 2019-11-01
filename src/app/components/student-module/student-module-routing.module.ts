import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentModuleComponent, StudentHomeComponent, StudentAddComponent, StudentBulkComponent,
   StudentEditComponent, RegisteredStudentsComponent, StudentsComponent, StudentsArchivedReportComponent, ViewReportCardComponent } from '.';

const routes: Routes = [
  {
    path:'',
    component:StudentModuleComponent,
    children: [
      {
          path: '',
          component: StudentHomeComponent,
          pathMatch: 'prefix',
      },
      {
          path: 'home',
          component: StudentHomeComponent,
          pathMatch: 'prefix',
      },
      {
          path: 'add',
          component: StudentAddComponent,
          pathMatch: 'prefix',
      },
      {
          path: 'edit/:id',
          component: StudentEditComponent,
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
        path: 'reportcard/:id',
        component: ViewReportCardComponent,
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
