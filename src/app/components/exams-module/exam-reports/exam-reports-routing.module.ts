import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeritStageComponent } from './merit-stage/merit-stage.component';
import { TerminalReportComponent } from './terminal-report/terminal-report.component';


const routes: Routes = [
  {
    path: '',
    component: TerminalReportComponent
  },
  {
    path: 'terminal-report',
    component: TerminalReportComponent
  },
  {
    path: 'merit-stage-report',
    component: MeritStageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamReportsRoutingModule { }
