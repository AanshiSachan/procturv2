import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  CommunicateComponent, CoummunicateHomeComponent, PtmManagementComponent, ExamReportComponent,
  EmailReportComponent,
  EventManagmentComponent
} from '.';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CommunicateComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        component: CoummunicateHomeComponent
      },
      {
        path: 'ptm',
        component: PtmManagementComponent
      },
      {
        path: 'sms',
        loadChildren: 'app/components/communicate/sms-reports/sms-reports.module#SmsReportsModule',
        pathMatch: 'prefix'
      },
      {
        path: 'exam',
        component: ExamReportComponent
      },
      {
        path: 'email',
        component: EmailReportComponent
      },
      {
        path: 'event',
        component: EventManagmentComponent,
        canLoad: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicateRoutingModule { }
