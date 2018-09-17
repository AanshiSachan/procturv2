import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

/* Method declared for future purpose for setting authorization after successfull login */

@Injectable()
export class AuthenticatorService {
    public token: string = null;
    public institute_id: any = null;
    public standard_id: any = null;
    public institution_type: any = null;

    private instituteId = new BehaviorSubject<any>(null);
    private authToken = new BehaviorSubject<any>(null);

    currentInstituteId = this.instituteId.asObservable();
    currentAuthKey = this.authToken.asObservable();
    isMainBranch = new BehaviorSubject('N');
    institute_type = new BehaviorSubject('LANG');
    course_flag = new BehaviorSubject('0');
    instituteType_name = new BehaviorSubject('LANG');

    public baseUrl: string = "http://test999.proctur.com/StdMgmtWebAPI";
    // public baseUrl: string = "https://app.proctur.com/StdMgmtWebAPI";
    public baseUrlStudent: string = window.location.origin;

    constructor() {
        this.getAuthToken();
        this.getInstituteId();
        this.getIsMainBranchValue();
        this.getInstituteType();
    }


    changeInstituteId(id: string) {
        this.instituteId.next(id);
    }

    changeAuthenticationKey(key: string) {
        this.authToken.next(key);
    }


    getAuthToken() {
        let obj: any = {
            userid: sessionStorage.getItem('userid'),
            userType: sessionStorage.getItem('userType'),
            password: sessionStorage.getItem('password'),
            institution_id: sessionStorage.getItem('institute_id'),
        }

        if (obj != null && obj != undefined) {
            let Authorization = btoa(obj.userid + "|" + obj.userType + ":" + obj.password + ":" + obj.institution_id);
            let token = Authorization;
            if (token != null) {
                this.changeAuthenticationKey(token);
            }
        }
    }

    getInstituteType() {
        let type = sessionStorage.getItem('institute_type');
        if (type != null && type != "" || type != undefined) {
            //this.institute_type.next(type);
            this.instituteType_name.next(type);
        }
        let courseflag = sessionStorage.getItem('course_structure_flag');
        if (courseflag != null && courseflag != undefined) {
            this.course_flag.next(courseflag);
        }
        this.makeInstituteType(type, courseflag);
    }

    getInstituteId() {
        let id = sessionStorage.getItem('institute_id');
        if (id != null && id != undefined) {
            this.changeInstituteId(id);
        }
    }

    getStandardId() {
        this.standard_id = sessionStorage.getItem('standard_id');
        if (this.standard_id != null && this.standard_id != undefined) {
            return this.standard_id;
        }
        else {
        }
    }

    getIsMainBranchValue() {
        let mainBranch = sessionStorage.getItem('is_main_branch');
        if (mainBranch != null && mainBranch != undefined) {
            this.isMainBranch.next(mainBranch);
        }
    }

    changeMainBranchValue(value) {
        this.isMainBranch.next(value);
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }


    getBaseUrlStudent(): string {
        return this.baseUrlStudent;
    }

    clearStoredData() {
        this.token = null;
        this.institute_id = null;
        this.standard_id = null;
        this.institute_type.next('LANG');
        this.isMainBranch.next('N');
        this.institution_type = null;
        this.course_flag.next('0');
        this.instituteType_name.next('LANG');
        sessionStorage.setItem('Authorization', null);
        sessionStorage.setItem('institute_id', null);
        sessionStorage.setItem('institute_type', null);
    }

    makeInstituteType(type, course_flag) {
        if (type == "LANG" && course_flag == '0') {
            this.institute_type.next('LANG');
        } else if (type == "ACAD" && course_flag == '0') {
            this.institute_type.next('LANG');
        } else if (type == "ACAD" && course_flag == '1') {
            this.institute_type.next('ACAD');
        } else if (type == "ACAD_COURSE" && course_flag == '0') {
            this.institute_type.next('LANG');
        } else if (type == "ACAD_COURSE" && course_flag == '1') {
            this.institute_type.next('ACAD_COURSE');
        } else if (type == "SCHOOL" && course_flag == '1') {
            this.institute_type.next('SCHOOL');
        } else if (type == "SCHOOL" && course_flag == '0') {
            this.institute_type.next('LANG');
        } else {
            this.institute_type.next('LANG');
        }
    }

    checkInternetConnection() {
        return Observable.merge(
            Observable.of(navigator.onLine),
            Observable.fromEvent(window, 'online').map(() => true),
            Observable.fromEvent(window, 'offline').map(() => false));
    }

}
