import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudentCustomComponent } from './student-custom-comp/student-custom-comp.component';
import { CustomCommonComponent } from './custom-common.component';
import { CreateCustomCompComponent } from './create-custom-comp/create-custom-comp.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: CustomCommonComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        component: CreateCustomCompComponent 
                    },
                    {
                        path: 'home',
                        component: CreateCustomCompComponent,
                        pathMatch: 'prefix'
                    },
                    {
                        path: 'customizedOnly',
                        component: StudentCustomComponent,
                        pathMatch: 'prefix'
                    }

                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class CustomCommonRoutingModule {
}