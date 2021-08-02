import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthPageComponent } from './auth-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import {NotConfiguredComponent} from './not-configured/not-configured.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AuthPageComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        component: LoginPageComponent
                    },
                    {
                        path: 'loginAuth',
                        component: LoginPageComponent,
                        pathMatch: 'prefix',
                    },
                    {
                        path: 'not-configured',
                        component: NotConfiguredComponent,
                        pathMatch: 'prefix',
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AuthPageRoutingModule {
}