import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from './authenticator.service';

@Injectable()

export class EventManagmentService {

  baseUrl: string = '';
  institute_id: string;
  Authorization: string;
  headers;

  constructor(private http: HttpClient, private auth: AuthenticatorService) {
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

  getListEventDesc(obj) {
    let url = this.baseUrl + "/api/v1/holiday_manager/getDetail/" + this.institute_id;
    return this.http.post(url, obj, { headers: this.headers }).map(
      res => {
        return res
      },
      error => {
        return error
      },
    )
  }
  getEventdata() {
    let url = this.baseUrl + "/api/v1/masterData/type/EVENT_TYPE/";
    return this.http.get(url, { headers: this.headers }).map(
      res => {
        return res
      },
      error => {
        return error
      },
    )
  }
  getHolidayData() {
    let url = this.baseUrl + "/api/v1/masterData/type/HOLIDAY_TYPE/"
    return this.http.get(url, { headers: this.headers }).map(
      res => {
        return res
      },
      error => {
        return error
      },
    )
  }

  editEventData(obj) {
    let url = this.baseUrl + "/api/v1/holiday_manager/fetch/" + this.institute_id + "/" + obj;
    return this.http.get(url, { headers: this.headers }).map(
      res => {
        return res
      },
      error => {
        return error
      },
    )
  }

  saveEventDescData(obj) {
    let url = this.baseUrl + "/api/v1/holiday_manager/create/";
    obj.institution_id = this.institute_id;
    return this.http.post(url, obj, { headers: this.headers }).map(
      res => {
        return res
      },
      error => {
        return error
      },
    )
  }

  sendNotifiation(obj) {
    let url = this.baseUrl + "/api/v1/pushNotification/send";
    obj.institution_id = this.institute_id;
    return this.http.post(url, obj, { headers: this.headers }).map(
      res => {
        return res
      },
      error => {
        return error
      },
    )
  }

  updateEventData(holidayId): any {
    let url = this.baseUrl + "/api/v1/holiday_manager/fetch/" + this.institute_id + "/" + holidayId
    return this.http.get(url, { headers: this.headers }).map(
      res => {
        return res
      },
      error => {
        return error
      },
    )
  }

  getUpdateEventData(obj) {
    let url = this.baseUrl + "/api/v1/holiday_manager/update";
    obj.institution_id = this.institute_id;
    return this.http.put(url, obj, { headers: this.headers }).map(
      res => {
        return res
      },
      error => {
        return error
      },
    )
  }

  deleteEventData(holidayId) {
    let url = this.baseUrl + "/api/v1/holiday_manager/delete/" + this.institute_id + "/" + holidayId
    return this.http.delete(url, { headers: this.headers }).map(
      res => {
        return res
      },
      error => {
        return error
      },
    )
  }

}

