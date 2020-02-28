import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';



@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                { path: '', redirectTo: '/authPage', pathMatch: 'full' },
                {
                    path: 'authPage',
                    loadChildren: 'app/components/auth-page/auth-page.module#AuthPageModule'
                },
                {
                    path: 'guest',
                    loadChildren: 'app/components/guest-user/guest-user.module#GuestUserModule'
                },
                {
                    path: 'view',
                    loadChildren: 'app/components/component.module#ComponentModule'
                },
                { path: '**',  redirectTo: '/authPage', pathMatch: 'full' }
            ],
            {
                useHash: true,
                preloadingStrategy: PreloadAllModules
            }
        )
    ],
    exports: [
        RouterModule
    ],
    providers: [
        /* CanDeactivateGuard */
    ]
})
export class AppRoutingModule {
}