import { Injectable } from '@angular/core';
import { AuthenticatorService } from '../authenticator.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()

export class EmployeeService {

    baseUrl: string = '';
    Authorization: any;
    headers;
    institute_id;

    constructor(
        private auth: AuthenticatorService,
        private http: HttpClient
    ) {

        this.auth.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });

        this.baseUrl = this.auth.getBaseUrl();

    }

    getEmployeeList() {
        let url = this.baseUrl + "/api/v1/emp_manager/getAll/" + this.institute_id;
        return this.http.post(url, {}, { headers: this.headers }).map(
            res => { return res; }
        )
    }

    getDaysList() {
        let url = this.baseUrl + "/api/v1/masterData/type/DAY_OF_WEEK";
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res; }
        )
    }

    updateWorkingDays(obj) {
        obj.institution_id = this.institute_id;
        let url = this.baseUrl + "/api/v1/emp_manager/updateWorkingDays";
        return this.http.put(url, obj, { headers: this.headers }).map(
            res => { return res }
        )
    }

    //Add Edit Employee Api


    addNewEmployee(obj) {
        obj.institution_id = this.institute_id;
        let url = this.baseUrl + "/api/v1/emp_manager/create";
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

    updateEmployee(obj) {
        obj.institution_id = this.institute_id;
        let url = this.baseUrl + "/api/v1/emp_manager/update";
        return this.http.put(url, obj, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

    getEmployeeDetails(id) {
        let url = this.baseUrl + "/api/v1/emp_manager/getDetail/" + this.institute_id + '/' + id;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

    designationList() {
        let url = this.baseUrl + "/api/v1/masterData/type/EMPLOYEE_DESIGNATION";
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

    userList(obj) {
        let url = this.baseUrl + "/api/v1/emp_manager/getUsers/" + this.institute_id;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

}