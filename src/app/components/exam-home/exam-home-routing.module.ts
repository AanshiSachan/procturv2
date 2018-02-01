import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExamHomeComponent } from './exam-home.component';
import { HomeComponent } from './home/home.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ExamHomeComponent,
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
export class ExamHomeRoutingModule {
}