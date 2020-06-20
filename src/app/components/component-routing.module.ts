import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentsComponent } from './components.component';
import { AuthGuard } from '../guards/auth.guard';
import { TrainingVideoComponent } from './training-video/training-video.component';

@NgModule({
    imports: [
        RouterModule.forChild(
            [
                {
                    path: '',
                    component: ComponentsComponent,
                    pathMatch: 'prefix',
                    children: [
                        {
                            path: '',
                            redirectTo: 'home', pathMatch: 'full'
                        },
                        {
                            path: 'admin',
                            redirectTo: 'home', pathMatch: 'full'
                        },
                        {
                            path: 'home',
                            loadChildren: 'app/components/homepage-dashboard/homepage-dashboard.module#HomepageDashboardModule'
                        },
                        {
                            path: 'SMS',
                            loadChildren: 'app/components/allocate-sms/allocate-sms.module#AllocateSmsModule'
                        },
                        {
                            path: 'formField',
                            loadChildren: 'app/components/custom-common/custom-common.module#CustomCommonModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'teacher',
                            loadChildren: 'app/components/teacher/teacher.module#TeacherModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'leads',
                            loadChildren: 'app/components/leads/leads.module#LeadsModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'online-exam',
                            loadChildren: 'app/components/online-exam-module/online-exam.module#OnlineExamModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'employee',
                            loadChildren: 'app/components/employee-home/employee-home.module#EmployeeHomeModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'inventory',
                            loadChildren: 'app/components/inventory/inventory.module#InventoryModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'expense',
                            loadChildren: 'app/components/expense-management/expense-management.module#ExpenseManagementModule',
                            canLoad: [AuthGuard]
                        }, 
                       {
                            path:'fee',
                            loadChildren:'app/components/fee-module/fee.module#FeeModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path:'communicate',
                            loadChildren:'app/components/communicate/communicate.module#CommunicateModule',
                        },
                        {
                            path:'course',
                            loadChildren:'app/components/course-module/course-module.module#CourseModule2',
                        },
                        {
                            path:'batch',
                            loadChildren:'app/components/course-module/course-module.module#CourseModule2',
                        },
                        {
                            path: 'help',
                            loadChildren: 'app/components/help-home/help-home.module#HelpHomeModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'master',
                            loadChildren: 'app/components/master/master.module#ManageExamModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'setting',
                            loadChildren: 'app/components/institute-settings/institutes-setting.module#InstituteSettingModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'account',
                            loadChildren: 'app/components/institute-details/institute-details.module#InstituteDetailsModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'manage',
                            loadChildren: 'app/components/users-management/users-management.module#UserManagementModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'library',
                            loadChildren: 'app/components/library-management/library-management.module#LibraryManagementModule',
                        },
                        {
                            path: 'e-store',
                            loadChildren: 'app/components/eStore-module/estore.module#EstoreModule'
                        },
                        {
                            path: 'training-video',
                            component: TrainingVideoComponent,
                        },
                        {
                            path: 'live-classes',
                            loadChildren: 'app/components/live-classes-module/live-classes.module#LiveClassesModule'
                        },
                        {
                            path:'students',
                            loadChildren:'app/components/student-module/student-module.module#StudentModule2',
                            canLoad:[AuthGuard]
                        }
                    ]
                },
            ]
        )
    ],
    exports: [
        RouterModule
    ]
})
export class ComponentRoutingModule {
}
