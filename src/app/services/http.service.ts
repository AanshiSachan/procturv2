import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from './authenticator.service';


@Injectable()
export class HttpService {

  baseUrl: string = '';
  Authorization: any;
  headers: any;
  institute_id: any;

  constructor(
    private http: HttpClient,
    private auth: AuthenticatorService,
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

  getData(objecturl) {
    let url = this.baseUrl + objecturl;
    return this.http.get(url, { headers: this.headers }).map(
      data => {
        return data;
      },
      err => {
        return err;
      }
    )
  }

  postData(objecturl, obj) {
    let url = this.baseUrl + objecturl;
    return this.http.post(url, obj, { headers: this.headers }).map(
      data => {
        return data;
      },
      err => {
        return err;
      }
    )
  }

  putData(objecturl, obj) {
    let url = this.baseUrl + objecturl;
    return this.http.put(url, obj, { headers: this.headers }).map(
      data => {
        return data;
      },
      err => {
        return err;
      }
    )
  }
}