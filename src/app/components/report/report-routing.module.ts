import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportComponent } from './report.component';
import { ReportHomeComponent } from './report-home/report-home.component'
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { BiometricComponent } from './biometric/biometric.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ReportComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        component: ReportHomeComponent
                    },
                    {
                        path: 'home',
                        component: ReportHomeComponent
                    },
                    {
                        path: 'biometric',
                        component: BiometricComponent
                    },
                    {
                        path: 'reportCard',
                        loadChildren: 'app/components/report/report-card/report-card.module#ReportCardModule',
                    },
              
                    {
                        path: 'profitNloss',
                        component: ProfitLossComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ReportRoutingModule {
}
