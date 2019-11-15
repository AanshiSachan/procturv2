import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MonitoringDashboardComponent } from './monitoring-dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: DashboardHomeComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        redirectTo: 'home'
                    },
                    {
                        path: 'home',
                        component: DashboardHomeComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MonitoringRoutingModule {
}