import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticatorService } from '../authenticator.service';

@Injectable()

export class CourseListService {

    baseURL: string = "";
    Authorization: any;
    headers;
    institute_id;

    constructor(
        private http: HttpClient,
        private auth: AuthenticatorService,
    ) {
        this.auth.currentAuthKey.subscribe( key => {
            this.Authorization = key;
            this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
          }) 
          this.auth.currentInstituteId.subscribe( id => {
            this.institute_id = id;
          });
        this.baseURL = this.auth.getBaseUrl();
    }

    getCourseListFromServer() {
        let url = this.baseURL + "/api/v1/courseMaster/fetch/" + this.institute_id + "/all";
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        );
    }

    getStandardListFromServer() {
        let url = this.baseURL + "/api/v1/standards/all/" + this.institute_id + '?active=Y';
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        );
    }

    getSubjectListOfStandard(data) {
        let url = this.baseURL + "/api/v1/subjects/standards/" + data + "?active=Y";
        return this.http.get(url, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

    getTeacherListFromServer() {
        let url = this.baseURL + "/api/v1/teachers/all/" + this.institute_id + "?active=Y";
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        )
    }

    getStudentList(data) {
        data.institute_id = this.institute_id;
        let url = this.baseURL + "/api/v1/courseMaster/fetch/courses/" + this.institute_id + '/' + data.course_id + "/students";
        return this.http.post(url, data, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        )
    }

    saveUpdatedList(data, ID) {
        data.institute_id = this.institute_id;
        let url = this.baseURL + "/api/v1/courseMaster/course/" + ID + '/assignStudents';
        return this.http.post(url, data, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        )
    }

    getFeeTemplate(course_id) {
        //https://test999.proctur.com/StdMgmtWebAPI/api/v1/studentWise/fee/fee_template_country_wise/100135?course_id=432&subject_id=-1
        let url = this.baseURL + "/api/v1/studentWise/fee/fee_template_country_wise/" + this.institute_id + "?course_id=" + course_id + "&subject_id=-1";
        return this.http.get(url, { headers: this.headers }).map(
            res => {
                return res;
            },
            error => {
                return error;
            }
        )
    }


    /////// Edit Couse //////

    getSeletedMasterCourseEdit(course_name) {
        let url = this.baseURL + "/api/v1/courseMaster/fetch/" + this.institute_id + '/' + course_name;
        return this.http.get(url, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }


    ////// Edit Save Course /////

    saveCourseDetails(data) {
        data.inst_id = this.institute_id;
        let url = this.baseURL + "/api/v1/courseMaster/create";
        return this.http.post(url, data, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

    /// Edit Component Update Course //////////

    updateDetailsInEdit(data) {
        data.inst_id = this.institute_id;
        let url = this.baseURL + "/api/v1/courseMaster/update";
        return this.http.put(url, data, { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }

    /// Edit Component Delete Subject //////////

    deleteSubjectFromServer(subjectId) {
        let url = this.baseURL + "/api/v1/courseMaster/deleteSubject/" + subjectId;
        return this.http.put(url, '', { headers: this.headers }).map(
            data => {
                return data;
            },
            error => {
                return error;
            }
        )
    }


    //  Get acadmeic Year Details

    getAcadYear() {
        let url = this.baseURL + "/api/v1/academicYear/all/" + this.institute_id;
        return this.http.get(url, { headers: this.headers }).map(
            data => {
                return data;
            },
            err => {
                return err;
            }
        )
    }

}