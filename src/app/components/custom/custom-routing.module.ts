import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import {CustomErrorPageComponent} from './custom-error-page/custom-error-page.component';
import { CustomComponent } from './custom.component';


@NgModule({
    imports:[
        RouterModule.forChild([
            {
                path: '',
                component: CustomComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        component: CustomErrorPageComponent
                    }
                ]
            }
        ])
    ],
    exports:[RouterModule]
})
export class CustomRoutingModule {
}