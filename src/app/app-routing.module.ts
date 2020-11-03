import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { CustomPreloadingStrategy } from './custom-preloading-strategy.service';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                { 
                    path: '', redirectTo: '/authPage', pathMatch: 'full',
                    data:{preload: true}
                 },
                {
                    path: 'authPage',
                    loadChildren: () => import('app/components/auth-page/auth-page.module').then(m => m.AuthPageModule),
                    // loadChildren: 'app/components/auth-page/auth-page.module#AuthPageModule',
                    data:{preload: true}
                },
                {
                    path: 'guest',
                    loadChildren: () => import('app/components/guest-user/guest-user.module').then(m => m.GuestUserModule)
                    // loadChildren: 'app/components/guest-user/guest-user.module#GuestUserModule'
                },
                {
                    path: 'view',
                    loadChildren: () => import('app/components/component.module').then(m => m.ComponentModule)
                    // loadChildren: 'app/components/component.module#ComponentModule',

                },
                { path: '**',  redirectTo: '/authPage', pathMatch: 'full' }
            ],
            {
                useHash: true,
                preloadingStrategy: CustomPreloadingStrategy
            }
        )
    ],
    exports: [RouterModule],
    providers: [CustomPreloadingStrategy]
})
export class AppRoutingModule {
}