import { Injectable } from '@angular/core';
import { Route, Router, CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { role } from '../model/role_features';
// import { tr } from 'ngx-bootstrap/bs-moment/i18n/tr';

/* For future purpose when routing will be allowed only if router is activated */

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
    role_feature = role.features;

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // if (localStorage.getItem('clientData')) {
        //     // logged in so return true
        //     return true;
        // }  //have not used 

        // not logged in so redirect to login page with the return url and return false
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    canLoad(route: Route): boolean {
        let url = `/${route.path}`;
        return this.checkLogin(url);
    }


    checkLogin(string): boolean {

        if ((sessionStorage.getItem('userid') != null) && sessionStorage.getItem('institute_id') != null) {


            if (string.indexOf('leads') >= 0) {
                return this.hasEnquiryAccess();
            }


            else if (string.indexOf('student') >= 0) {
                return this.hasStudentAccess();
            }

            else if (string.indexOf('course') >= 0 || string.indexOf('batch') >= 0) {
                return this.hasCourseAccess();
            }
  
            else if (string.indexOf('online-exam') >= 0) {
                return this.hasOnlineExamAcess();
            }

            else if (string.indexOf('employee') >= 0) {
                return this.hasEmployeeAccess();
            }

            // else if (string.indexOf('reports') >= 0) {
            //     return this.hasReportAccess();
            // }

            else if (string.indexOf('inventory') >= 0) {
                return this.hasInventoryAccess();
            }

            else if (string.indexOf('expense') >= 0) {
                return this.hasExpenseAccess();
            }

            else if (string.indexOf('campaign') >= 0) {
                return this.hasCampaignAccess();
            }

            else if (string.indexOf('exams') >= 0) {
                return this.hasExamAccess();
            }

            else if (string.indexOf('help') >= 0) {
                return true;
            }

            else if (string.indexOf('slot') >= 0) {
                return true;
            }

            else if (string.indexOf('formField') >= 0) {
                return true;
            }

            else if (string.indexOf('teacher') >= 0) {
                return this.hasTeacher();
            }

            else if (string.indexOf('fee') >= 0) {
                return this.hasFeeAccess();
            }

            else if (string.indexOf('classroom') >= 0) {
                return this.hasTeacher();
            }

            else if (string.indexOf('academic') >= 0) {
                return true;
            }

            else if (string.indexOf('master') >= 0) {
                return true;
            }

            else if (string.indexOf('setting') >= 0) {
                return true;
            }

            else if (string.indexOf('account') >= 0) {
                return true;
            }

            else if (string.indexOf('manage') >= 0) {
                return true;
            }
        }
        else {
            return false;
        }

    }

    hasEnquiryAccess(): boolean {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (this.role_feature.LEAD_MANAGE_ENQUIRY ||
                this.role_feature.LEAD_MENU_ITEM ||
                this.role_feature.LEAD_ENQUIRY_FULL_ACCESS || this.role_feature.REPORTS_MENU) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    hasStudentAccess(): boolean {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (this.role_feature.STUDENT_MANAGE || this.role_feature.STUDENT_MENU_ITEM) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    hasCourseAccess(): boolean {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (this.role_feature.EXAMS_MENU ||
                this.role_feature.CLASS_MENU || this.role_feature.REPORTS_MENU) {

                return true;
            }
            else {
                return false;
            }
        }
    }

    hasOnlineExamAcess(): boolean {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if(this.role_feature.ONLINE_TESTS_MENU) {
                return true;
            } else {
                return false;
            }
        }
    }

    hasEmployeeAccess(): boolean {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('118') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('119') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('120')) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    hasReportAccess(): boolean {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (this.role_feature.REPORT_COURSE_ATTENDANCE || this.role_feature.REPORTS_MENU ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('202') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('203') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('722')) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    hasInventoryAccess(): boolean {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (this.role_feature.STUDENT_MANAGE || this.role_feature.STUDENT_MENU_ITEM) {
                return true;
            }
            else {
                return false;
            }
        } 
    }

    hasExpenseAccess(): boolean {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('108') ||
                this.role_feature.INCOME_EXPENSE_ADMIN || this.role_feature.REPORT_INCOME_EXPENSE_REPORT) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    hasCampaignAccess(): boolean {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (this.role_feature.LEAD_ENQUIRY_FULL_ACCESS) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    hasExamAccess(): boolean {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (this.role_feature.EXAMS_MENU ||
                this.role_feature.CLASS_MENU) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    hasMaster() {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (
                this.role_feature.SETUP_MENU) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    hasTeacher() {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
    }

    hasFeeAccess() {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (this.role_feature.FEE_MENU || this.role_feature.REPORTS_MENU) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    hasSlotsAccess() {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (this.role_feature.SETUP_MENU) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    hasClassroom() {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (this.role_feature.SETUP_MENU) {
                return true;
            }
            else {
                return false;
            }
        }
    }

}
