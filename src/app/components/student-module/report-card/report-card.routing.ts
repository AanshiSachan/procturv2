import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportCardComponent } from './report-card.component';
import { ViewReportCardComponent } from './view-report-card/view-report-card.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ReportCardComponent
            },
            {
                path: 'view/:id',
                component: ViewReportCardComponent
            }
        ])
    ],

    exports: [
        RouterModule
    ]
})

export class ReportCardRouting { }