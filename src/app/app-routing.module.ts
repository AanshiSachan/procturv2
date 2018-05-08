import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';
/* import { CanDeactivateGuard }      from './guards/can-deactivate-guard.service'; */
import { AuthGuard } from './guards/auth.guard';
import { ErrorComponent } from './components/error/error.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { SlotComponent } from './components/slot/slot.component';
import { CityAreaMapComponent } from './components/city-area-map/city-area-map.component';
import { ClassRoomComponent } from './components/class-room/class-room.component';
import { EventManagmentComponent } from './components/event-managment/event-managment.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                { path: '', redirectTo: '/authPage', pathMatch: 'full', },
                {
                    path: 'home',
                    loadChildren: 'app/components/homepage-dashboard/homepage-dashboard.module#HomepageDashboardModule'
                },
                {
                    path: 'authPage',
                    loadChildren: 'app/components/auth-page/auth-page.module#AuthPageModule'

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
                    path: 'enquiry',
                    loadChildren: 'app/components/enquiry/enquiry.module#EnquiryModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'student',
                    loadChildren: 'app/components/students/student.module#StudentModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'course',
                    loadChildren: 'app/components/course/course.module#CourseModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'activity',
                    loadChildren: 'app/components/activity-home/activity-home.module#ActivityHomeModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'employee',
                    loadChildren: 'app/components/employee-home/employee-home.module#EmployeeHomeModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'reports',
                    loadChildren: 'app/components/report/report.module#ReportModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'inventory',
                    loadChildren: 'app/components/inventory/inventory.module#InventoryModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'expense',
                    loadChildren: 'app/components/expense-home/expense-home.module#ExpenseHomeModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'campaign',
                    loadChildren: 'app/components/campaign/campaign.module#CampaignModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'fee',
                    loadChildren: 'app/components/fee-template/fee-template.module#FeeTemplateModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'help',
                    loadChildren: 'app/components/help-home/help-home.module#HelpHomeModule',
                    canLoad: [AuthGuard]
                },
                {
                    path: 'slot',
                    component: SlotComponent,
                    canLoad: [AuthGuard]
                },
                {
                    path: 'classroom',
                    component: ClassRoomComponent,
                    canLoad: [AuthGuard]
                },
                {
                    path: 'eventManagment',
                    component: EventManagmentComponent,
                    canLoad: [AuthGuard]
                },
                {
                    path: 'academic',
                    loadChildren: 'app/components/academic-year/academic-year.module#AcademicYearModule',
                },
                {
                    path: 'setting',
                    loadChildren: 'app/components/institute-settings/institutes-setting.module#InstituteSettingModule',
                },
                {
                    path: 'account',
                    loadChildren: 'app/components/institute-details/institute-details.module#InstituteDetailsModule',
                },
                {
                    path: 'areaCity',
                    component: CityAreaMapComponent,
                    // canLoad: [AuthGuard]
                },
                {
                    path: 'manage',
                    loadChildren: 'app/components/users-management/users-management.module#UserManagementModule',
                },
                { path: 'comingsoon', component: ComingSoonComponent },
                { path: '**', component: ErrorComponent },
            ],
            {
                useHash: true,
                /* preloadingStrategy: PreloadAllModules */
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