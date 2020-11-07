
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthenticatorService } from '../authenticator.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

    // EMployee HomePage API

    searchEmployee(name, number): Observable<any> {
        let url = `${this.baseUrl}/api/v2/employees?institution_id=${this.institute_id}&emp_name=${name}&phone_pro=${number}`;
        return this.http.post(url, {}, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err; }
        ))
    }

    // Add Edit API

    fetchDesignationList(): Observable<any> {
        let url = `${this.baseUrl}/api/v2/designation/allDesignation/${this.institute_id}`;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    fetchEmployeeList(): Observable<any> {
        let url = `${this.baseUrl}/api/v2/employees/all/${this.institute_id}`;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    getRoles() {
        let url = this.baseUrl + "/api/v1/roleApi/allRoles/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err; }
        ))
    }

    // NEw user Create 

    createNewUser(obj): Observable<any> {
        obj.institution_id = Number(this.institute_id);
        let url = `${this.baseUrl}/api/v2/employees/create`;
        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }


    // getEmpDetails

    getEmployeeDetails(id): Observable<any> {
        let url = `${this.baseUrl}/api/v2/employees/getEmployee/${this.institute_id}/${id}`;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res },
            err => { return err }
        ))
    }

    // update user details

    updateDetails(obj): Observable<any> {
        obj.institution_id = Number(this.institute_id);
        let url = `${this.baseUrl}/api/v2/employees/update`;
        return this.http.put(url, obj, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    //Send Notification Pop Up

    getMessageList(): Observable<any> {
        let url = `${this.baseUrl}/api/v2/employees/allNotificationMessage/${this.institute_id}`;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    addNewMessage(obj): Observable<any> {
        obj.institution_id = this.institute_id;
        let url = `${this.baseUrl}/api/v2/employees/notification/${this.institute_id}`;
        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    approveMessageStatus(obj, id): Observable<any> {
        obj.institution_id = this.institute_id;
        let url = `${this.baseUrl}/api/v2/employees/approve/${id}`;
        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    deleteMessage(id): Observable<any> {
        let url = `${this.baseUrl}/api/v2/employees/delete/${this.institute_id}/${id}`;
        return this.http.delete(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    editMessage(obj, id): Observable<any> {
        obj.institution_id = this.institute_id;
        let url = `${this.baseUrl}/api/v2/employees/updateNotification/${this.institute_id}/${id}`;
        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    sendNotificationToUser(obj) {
        obj.institution_id = this.institute_id;
        let url = `${this.baseUrl}/api/v2/employees/sendNotification`;
        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => { return res },
            err => { return err }
        ))
    }

    //workingHours

    getWorkingHours(id): Observable<any> {
        let url = `${this.baseUrl}/api/v2/employees/workingHours/${this.institute_id}/${id}`;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    createWorkingHours(obj): Observable<any> {
        obj.institution_id = this.institute_id;
        let url = `${this.baseUrl}/api/v2/employees/workingHours`;
        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    updateWorkingHours(obj, id): Observable<any> {
        obj.institution_id = this.institute_id;
        let url = `${this.baseUrl}/api/v2/employees/workingHours/${id}`;
        return this.http.put(url, obj, { headers: this.headers }).pipe(map(
            res => { return res },
            err => { return err }
        ))
    }

    getSalaryStructure(id): Observable<any> {
        let url = `${this.baseUrl}/api/v2/employees/salaryStructure/${this.institute_id}/${id}`;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    createSalaryStructure(obj): Observable<any> {
        obj.institution_id = this.institute_id;
        let url = `${this.baseUrl}/api/v2/employees/salaryStructure`;
        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    updateSalaryStructure(obj, id): Observable<any> {
        obj.institution_id = this.institute_id;
        let url = `${this.baseUrl}/api/v2/employees/salaryStructure/${id}`;
        return this.http.put(url, obj, { headers: this.headers }).pipe(map(
            res => { return res },
            err => { return err }
        ))
    }

    getItemList() {
        let url = `${this.baseUrl}/api/v1/inventory/item/all/${this.institute_id}`;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res },
            err => { return err }
        ))
    }

    getInventoryHistory(emp) {
        let url = `${this.baseUrl}/api/v2/employees/txHistory/${emp}`;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res },
            err => { return err }
        ))
    }

    allocateInventory(obj) {
        obj.institution_id = this.institute_id;
        let url = `${this.baseUrl}/api/v2/employees/allocateInventory`;
        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => { return res },
            err => { return err }
        ))
    }

}