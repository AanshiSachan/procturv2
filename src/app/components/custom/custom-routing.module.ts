import {NgModule}     from '@angular/core';
import {RouterModule} from '@angular/router';
import { CustomComponent } from './custom.component';


@NgModule({
    imports:[
        RouterModule.forChild([
            {
                path: '',
                component: CustomComponent,

            }
        ])
    ],
    exports:[RouterModule]
})
export class CustomRoutingModule {
}