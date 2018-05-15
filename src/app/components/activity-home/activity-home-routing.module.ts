import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivityHomeComponent } from './activity-home.component';
import { HomeComponent } from './home/home.component';
import {ManageExamModule} from './ptm-management/ptm-manangement.module'

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
                        path:'ptm'
                    }
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