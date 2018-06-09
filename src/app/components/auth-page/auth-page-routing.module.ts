import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthPageComponent } from './auth-page.component';
import { LoginPageComponent } from './login-page/login-page.component';

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