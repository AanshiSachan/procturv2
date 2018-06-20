import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules, NoPreloading } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';


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
                    path: 'view',
                    loadChildren: 'app/components/component.module#ComponentModule'
                }
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