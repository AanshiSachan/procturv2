import { Injectable } from '@angular/core';
import { AuthenticatorService } from '../authenticator.service';
import { AddCategory } from '../../model/inventory-category';
import { Http, Response, Request, Headers, XHRBackend } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class LiveClasses {
    baseUrl = '';
    Authorization: any;
    institute_id: string;
    headers;

    constructor(
        private http: HttpClient,
        private auth: AuthenticatorService
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

    fetchStudents(obj) {
        let url = this.baseUrl + '/api/v1/courseMaster/onlineClass/fetch/users'

        return this.http.post(url, obj, { headers: this.headers }).map(
            (data: any) => {
                return data;
            },
            (error: any) => {
                return error;
            }
        )
    }

    fetchTeachers() {
        let url = this.baseUrl + '/api/v1/teachers/all/' + this.institute_id
        return this.http.get(url, { headers: this.headers }).map(
            (data: any) => {
                return data;
            },
            (error: any) => {
                return error;
            }
        )
    }

    fetchUsers() {
        let url = this.baseUrl + '/api/v1/profiles/custUsers/' + this.institute_id
        return this.http.get(url, { headers: this.headers }).map(
            (data: any) => {
                return data;
            },
            (error: any) => {
                return error;
            }
        )
    }

    fetchBatches() {
        let url = this.baseUrl + '/api/v1/batches/all/' + this.institute_id + '?active=Y'
        return this.http.get(url, { headers: this.headers }).map(
            (data: any) => {
                return data;
            },
            (error: any) => {
                return error;
            }
        )
    }

    fetchMasters() {
        let url = this.baseUrl + '/api/v1/courseMaster/fetch/' + this.institute_id + '/all'
        return this.http.get(url, { headers: this.headers }).map(
            (data: any) => {
                return data;
            },
            (error: any) => {
                return error;
            }
        )
    }

    fetchCourses(obj) {
        let url = this.baseUrl + '/api/v1/courseMaster/fetch/' + this.institute_id + '/' + obj
        return this.http.get(url, { headers: this.headers }).map(
            (data: any) => {
                return data;
            },
            (error: any) => {
                return error;
            }
        )
    }

    getOnlineClasses(obj) {
        let url = this.baseUrl + '/api/v1/meeting_manager/create'
        return this.http.put(url, obj, { headers: this.headers }).map(
            (data: any) => {
                return data;
            },
            (error: any) => {
                return error;
            }
        )
    }

    fetchOnlineClasses(obj) {
        let url = this.baseUrl + '/api/v1/meeting_manager/getMeeting/' + this.institute_id
        return this.http.post(url, obj, { headers: this.headers }).map(
            (data: any) => {
                return data;
            },
            (error: any) => {
                return error;
            }
        )
    }

    getOnlineClass(sessionId){
      let url = this.baseUrl + '/api/v1/meeting_manager/getMeeting/' + this.institute_id +"/"+sessionId;
      return this.http.get(url, { headers: this.headers }).map(
          (data: any) => {
              return data;
          },
          (error: any) => {
              return error;
          }
      )
    }

    updateOnlineClass(obj, sessionId){
      let url = this.baseUrl + '/api/v1/meeting_manager/update/'+ this.institute_id +"/"+ sessionId;
      return this.http.post(url, obj, { headers: this.headers }).map(
          (data: any) => {
              return data;
          },
          (error: any) => {
              return error;
          }
      )
    }

    pushNotification(sessionId, obj) {
        let url = this.baseUrl + "/api/v1/meeting_manager/sendPushNotification/" + sessionId;
        return this.http.post(url, obj, { headers: this.headers }).map(
            (data: any) => {
                return data;
            },
            (error: any) => {
                return error;
            }
        )
    }

    smsNotification(sessionId, obj) {
        let url = this.baseUrl + "/api/v1/meeting_manager/sendSMSNotification/" + sessionId;
        return this.http.post(url, obj, { headers: this.headers }).map(
            (data: any) => {
                return data;
            },
            (error: any) => {
                return error;
            }
        )
    }

    cancelSchedule(sessionId) {
        let url = this.baseUrl + "/api/v1/meeting_manager/delete/" + this.institute_id + "/" + sessionId;
        return this.http.delete(url, { headers: this.headers }).map(
            (data: any) => {
                return data;
            },
            (error: any) => {
                return error;
            }
        )
    }

    rescheduleClass(obj ){
        let url = this.baseUrl + "/api/v1/meeting_manager/reschedule/" + this.institute_id + "/" + obj.session_id;
        return this.http.post(url, obj , { headers: this.headers }).map(
            (data: any) => {
                return data;
            },
            (error: any) => {
                return error;
            }
        )
    }
}
