import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivityHomeComponent } from './activity-home.component';
import { HomeComponent } from './home/home.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ActivityHomeComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        redirectTo: 'dashboard'
                    },
                    {
                        path: 'dashboard',
                        component: HomeComponent
                    },
                    {
                        path: 'manage',
                        loadChildren: 'app/components/activity-home/fee-activity/fee-activity.module#FeeActivityModule',
                        pathMatch: 'prefix'
                    },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ActivityHomeRoutingModule {
}