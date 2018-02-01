import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsHomeComponent } from './settings-home.component';
import { HomeComponent } from './home/home.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SettingsHomeComponent,
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
export class SettingsHomeRoutingModule {
}