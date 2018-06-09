import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomepageDashboardComponent } from './homepage-dashboard.component';
// import { HomeComponent } from './home/home.component';
import { AdminHomeComponent } from './admin-home/admin-home.component'

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
                        redirectTo: 'admin'
                    },
                    // {
                    //     path: 'home',
                    //     component: HomeComponent
                    // }, 
                    {
                        path: 'admin',
                        component: AdminHomeComponent
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