import { Injectable } from '@angular/core';
import { Route, Router, CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { tr } from '../../assets/imported_modules/ngx-bootstrap/bs-moment/i18n/tr';

/* For future purpose when routing will be allowed only if router is activated */

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('clientData')) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url and return false
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    canLoad(route: Route): boolean {
        let url = `/${route.path}`;

        return this.checkLogin(url);
    }


    checkLogin(string): boolean {

        if ((sessionStorage.getItem('Authorization') != null) && sessionStorage.getItem('institute_id') != null) {

            if (string.indexOf('enquiry') >= 0) {
                return this.hasEnquiryAccess();
            }
            else if (string.indexOf('student') >= 0) {

                return this.hasStudentAccess();
            }
            else if (string.indexOf('custom') >= 0) {

                return true;
            }
            else if (string.indexOf('campaign') >= 0) {

                return this.hasCampaignAccess();
            }
            else if (string.indexOf('course') >= 0) {

                return this.hasCourseAccess();
            }
            else if (string.indexOf('reports') >= 0) {

                return this.hasReportAccess();
            }
            else if (string.indexOf('inventory') >= 0) {
                return this.hasInventoryAccess();
            }
            else if (string.indexOf('teacher') >= 0) {
                return this.hasTeacher();
            }
            else if (string.indexOf('fee') >= 0) {
                return this.hasTeacher();
            }
            else if (string.indexOf('classroom') >= 0) {
                return this.hasTeacher();
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
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('110') || JSON.parse(sessionStorage.getItem('permissions')).includes('115')) {
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
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('301') || JSON.parse(sessionStorage.getItem('permissions')).includes('302') || JSON.parse(sessionStorage.getItem('permissions')).includes('303')) {
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
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('401') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('402') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('403') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('404') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('405') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('406')) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    hasActivityAccess(): boolean {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('101') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('102') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('103') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('104') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('105') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('110') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('112') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('113') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('114') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('121')) {
                return true;
            }
            else {
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
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('201') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('202') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('203') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('204') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('205') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('206') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('207') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('208')) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    hasInventoryAccess(): boolean {
        /* if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('201')) {
                return true;
            }
            else {
                return false;
            }
        } */
        return true;
    }

    hasExpenseAccess(): boolean {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('108') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('109')) {
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
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('115')) {
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
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('103') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('112') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('404') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('405') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('406') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('206') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('702') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('704') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('706')) {
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
                JSON.parse(sessionStorage.getItem('permissions')).includes('503') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('507') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('508') ||
                JSON.parse(sessionStorage.getItem('permissions')).includes('506')) {
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
        else {
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('503')) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    hasFeeAccess() {
        if (sessionStorage.getItem('permissions') == '') {
            return true;
        }
        else {
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('506')) {
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
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('507')) {
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
            if (JSON.parse(sessionStorage.getItem('permissions')).includes('508')) {
                return true;
            }
            else {
                return false;
            }
        }
    }

}
