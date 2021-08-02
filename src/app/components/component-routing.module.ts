import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComponentsComponent } from './components.component';
import { AuthGuard } from '../guards/auth.guard';
import { TrainingVideoComponent } from './training-video/training-video.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ReportsComponent } from './reports/reports.component';



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
                            component: HomePageComponent
                        },
                        {
                            path: 'dashboard',

                            loadChildren: () => import('app/components/homepage-dashboard/homepage-dashboard.module').then(m => m.HomepageDashboardModule)
                            // loadChildren: 'app/components/homepage-dashboard/homepage-dashboard.module#HomepageDashboardModule'
                        },
                        {
                            path: 'SMS',
                            loadChildren: () => import('app/components/allocate-sms/allocate-sms.module').then(m => m.AllocateSmsModule)
                            // loadChildren: 'app/components/allocate-sms/allocate-sms.module#AllocateSmsModule'
                        },
                        {
                            path: 'formField',
                            loadChildren: () => import('app/components/custom-common/custom-common.module').then(m => m.CustomCommonModule),
                            // loadChildren: 'app/components/custom-common/custom-common.module#CustomCommonModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'teacher',
                            loadChildren: () => import('app/components/teacher/teacher.module').then(m => m.TeacherModule),
                            // loadChildren: 'app/components/teacher/teacher.module#TeacherModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'leads',
                            loadChildren: () => import('app/components/leads/leads.module').then(m => m.LeadsModule),
                            // loadChildren: 'app/components/leads/leads.module#LeadsModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'online-exam',
                            loadChildren: () => import('app/components/online-exam-module/online-exam.module').then(m => m.OnlineExamModule),
                            // loadChildren: 'app/components/online-exam-module/online-exam.module#OnlineExamModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'employee',
                            loadChildren: () => import('app/components/employee-home/employee-home.module').then(m => m.EmployeeHomeModule),
                            // loadChildren: 'app/components/employee-home/employee-home.module#EmployeeHomeModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'inventory',
                            loadChildren: () => import('app/components/inventory/inventory.module').then(m => m.InventoryModule),
                            // loadChildren: 'app/components/inventory/inventory.module#InventoryModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'expense',
                            loadChildren: () => import('app/components/expense-management/expense-management.module').then(m => m.ExpenseManagementModule),
                            // loadChildren: 'app/components/expense-management/expense-management.module#ExpenseManagementModule',
                            canLoad: [AuthGuard]
                        },



                        {
                            path: 'leave',
                            loadChildren: () => import('./leave/leave.module').then(m => m.LeaveModule),
                            pathMatch: 'prefix'

                        },




                        {
                            path: 'fee',
                            loadChildren: () => import('app/components/fee-module/fee.module').then(m => m.FeeModule),
                            // loadChildren:'app/components/fee-module/fee.module#FeeModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'communicate',
                            loadChildren: () => import('app/components/communicate/communicate.module').then(m => m.CommunicateModule)
                            // loadChildren:'app/components/communicate/communicate.module#CommunicateModule',
                        },
                        {
                            path: 'course',
                            loadChildren: () => import('app/components/course-module/course-module.module').then(m => m.CourseModule2)
                            // loadChildren:'app/components/course-module/course-module.module#CourseModule2',
                        },
                        {
                            path: 'batch',
                            loadChildren: () => import('app/components/course-module/course-module.module').then(m => m.CourseModule2)
                            // loadChildren:'app/components/course-module/course-module.module#CourseModule2',
                        },
                        {
                            path: 'help',
                            loadChildren: () => import('app/components/help-home/help-home.module').then(m => m.HelpHomeModule),
                            // loadChildren: 'app/components/help-home/help-home.module#HelpHomeModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'master',
                            loadChildren: () => import('app/components/master/master.module').then(m => m.ManageExamModule),
                            // loadChildren: 'app/components/master/master.module#ManageExamModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'setting',
                            loadChildren: () => import('app/components/institute-settings/institutes-setting.module').then(m => m.InstituteSettingModule),
                            // loadChildren: 'app/components/institute-settings/institutes-setting.module#InstituteSettingModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'account',
                            loadChildren: () => import('app/components/institute-details/institute-details.module').then(m => m.InstituteDetailsModule),
                            // loadChildren: 'app/components/institute-details/institute-details.module#InstituteDetailsModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'manage',
                            loadChildren: () => import('app/components/users-management/users-management.module').then(m => m.UserManagementModule),
                            // loadChildren: 'app/components/users-management/users-management.module#UserManagementModule',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'library',
                            loadChildren: () => import('app/components/library-management/library-management.module').then(m => m.LibraryManagementModule)
                            // loadChildren: 'app/components/library-management/library-management.module#LibraryManagementModule',
                        },
                        {
                            path: 'e-store',
                            loadChildren: () => import('app/components/eStore-module/estore.module').then(m => m.EstoreModule)
                            // loadChildren: 'app/components/eStore-module/estore.module#EstoreModule'
                        },
                        {
                            path: 'training-video',
                            component: TrainingVideoComponent,
                        },
                        {
                            path: 'live-classes',
                            loadChildren: () => import('app/components/live-classes-module/live-classes.module').then(m => m.LiveClassesModule)
                            // loadChildren: 'app/components/live-classes-module/live-classes.module#LiveClassesModule'
                        },
                        {
                            path: 'zoom',
                            loadChildren: () => import('app/components/live-classes-module/live-classes.module').then(m => m.LiveClassesModule)
                            // loadChildren: 'app/components/live-classes-module/live-classes.module#LiveClassesModule'
                        },
                        {
                            path:'students',
                            loadChildren: () => import('app/components/student-module/student-module.module').then(m => m.StudentModule2),
                            // loadChildren:'app/components/student-module/student-module.module#StudentModule2',
                            canLoad: [AuthGuard]
                        },
                        {
                            path: 'website-configuration',
                            loadChildren: () => import('../../app/components/website-configuration/website-configuration.module').then(m => m.WebsiteConfigurationModule),
                            // loadChildren: 'app/components/eStore-module/manage-coupon-home/manage-coupon-home.module#ManageCouponHomeModule',
                            pathMatch: 'prefix'
                        },
                        {
                         path: 'reports',
                         loadChildren: () => import('../components/reports/reports.module').then(m => m.ReportsModule)
                        },
                        {
                            path: 'exams',
                            loadChildren: () => import('../components/exams-module/exams-module.module').then(m => m.ExamsModuleModule)
                        },
                        {
                            path: 'asset-management',
                            loadChildren: () => import('../components/asset-management/asset-management.module').then(m => m.AssetManagementModule),
                            pathMatch: 'prefix'

                        },
                        {
                            path: 'inventory-management',
                            loadChildren: () => import('../components/inventory-module/inventory-module.module').then(m => m.InventoryModuleModule),
                            pathMatch: 'prefix'

                        },
                        {
                            path: 'sms-gateway',
                            loadChildren: () => import('../components/sms-gateway/sms-gateway.module').then(m => m.SmsGatewayModule),
                            pathMatch: 'prefix'

                        },

                        {
                            path: 'payrole',
                            loadChildren: () => import('../components/payrole/payrole.module').then(m => m.PayroleModule),
                            pathMatch: 'prefix'

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
