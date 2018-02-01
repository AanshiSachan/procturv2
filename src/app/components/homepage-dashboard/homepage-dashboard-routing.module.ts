import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomepageDashboardComponent } from './homepage-dashboard.component';
import { HomeComponent } from './home/home.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: HomepageDashboardComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        redirectTo: 'dashboard'
                    },
                    {
                        path: 'dashboard',
                        component: HomeComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class HomepageDashboardRoutingModule {
}