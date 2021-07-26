import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamReportsRoutingModule } from './exam-reports-routing.module';
import { TerminalReportComponent } from './terminal-report/terminal-report.component';
import { SharedModule } from '../../shared/shared.module';
import { MeritStageComponent } from './merit-stage/merit-stage.component';


@NgModule({
  declarations: [TerminalReportComponent, MeritStageComponent],
  imports: [
    CommonModule,
    ExamReportsRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class ExamReportsModule { }
