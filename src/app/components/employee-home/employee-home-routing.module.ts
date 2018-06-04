import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmployeeHomeComponent } from './employee-home.component';
import { HomeComponent } from './home/home.component';
import { AddEditEmployeeComponent } from './home/add-edit-employee/add-edit-employee.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: EmployeeHomeComponent,
                pathMatch: 'prefix',
                children: [
                    {
                        path: '',
                        redirectTo: 'home'
                    },
                    {
                        path: 'home',
                        component: HomeComponent
                    },
                    {
                        path: 'addedit/:id',
                        component: AddEditEmployeeComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class EmployeeHomeRoutingModule {
}