import { Injectable } from '@angular/core';
import { AuthenticatorService } from '../authenticator.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class ExamDeskCourseAssignmentService {

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

    getCoursesList(): Observable<any> {
        let url = `${this.baseUrl}/api/v1/institute/courseMapping/${this.institute_id}`;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

    getStandard(): Observable<any> {
        let url = `${this.baseUrl}/api/v1/standards/all/${this.institute_id}/?active=Y`;
        return this.http.get(url, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

    getStudentList(obj): Observable<any> {
        obj.institute_id = this.institute_id;
        let url = `${this.baseUrl}/api/v1/institute/studentCourseMapping/getStudAndUsers`;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

    assignStudentToCourse(obj, id): Observable<any> {
        obj.institute_id = this.institute_id;
        let url = `${this.baseUrl}/api/v1/institute/studentCourseMapping/${id}/assignStudents`;
        return this.http.post(url, obj, { headers: this.headers }).map(
            res => { return res },
            err => { return err }
        )
    }

}