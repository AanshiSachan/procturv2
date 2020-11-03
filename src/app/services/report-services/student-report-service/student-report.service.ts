
import {map} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticatorService } from '../../authenticator.service';

@Injectable()

export class StudentReportService {

    baseUrl: string = '';
    Authorization: any;
    headers;
    institute_id;

    constructor(
        private http: HttpClient,
        private auth: AuthenticatorService,
    ) {
        this.auth.currentAuthKey.subscribe(key => {
            this.Authorization = key;
            this.headers = new HttpHeaders(
                { "Content-Type": "application/json", "Authorization": this.Authorization });
        })
        this.auth.currentInstituteId.subscribe(id => {
            this.institute_id = id;
        });
        this.baseUrl = this.auth.getBaseUrl();
    }


    getMasterCourseAndSubjectList(standardid, subjectid, assigned): Observable<any> {
        let url = `${this.baseUrl}/api/v1/batches/fetchCombinedBatchData/${this.institute_id}/?standard_id=${standardid}&subject_id=${subjectid}&assigned=${assigned}`;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err; }
        ))
    }

    getStudentList(standard_id, subjectid, assigned, name, contact): Observable<any> {
        let url = `${this.baseUrl}/api/v1/students/all/${this.institute_id}?active=${assigned}&standard_id=${standard_id}&subject_id=${subjectid}&student_name=${name}&student_phone=${contact}`;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    // View Student Report Info

    fetchStudentReportDet(id): Observable<any> {
        let url = `${this.baseUrl}/api/v1/reports/Student/${id}`;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    fetchAttendance(obj) {
        obj.institute_id = this.institute_id;
        let url = `${this.baseUrl}/api/v1/reports/Student/getAttendance`;
        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    fetchPastDues(obj, id): Observable<any> {
        let url = `${this.baseUrl}/api/v1/studentWise/fee/feesReport/pastDues/${this.institute_id}/${id}`;
        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    fetchPastHistory(id): Observable<any> {
        let url = `${this.baseUrl}/api/v1/studentWise/fee/feesReport/pastHistory/${this.institute_id}/${id}`;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    fetchFutureDues(id): Observable<any> {
        let url = `${this.baseUrl}/api/v1/studentWise/fee/feesReport/futureDues/${this.institute_id}/${id}`;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    fetchTimetable(obj): Observable<any> {
        obj.institute_id = this.institute_id;
        let url = `${this.baseUrl}/api/v1/timeTable`;
        return this.http.post(url, obj, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

    getPTMDetails(id): Observable<any> {
        let url = `${this.baseUrl}/api/v1/ptm//student/${id}/details`;
        return this.http.get(url, { headers: this.headers }).pipe(map(
            res => { return res; },
            err => { return err }
        ))
    }

}