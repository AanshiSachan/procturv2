import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers, XHRBackend } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import * as moment from 'moment';

@Injectable()
export class FetchenquiryService {

  url: string;
  Authorization: string;
  headers: Headers;

  daterange = {
    updateDateFrom: '',
    updateDateTo: ''
  };

  constructor(private http: Http) {
    this.url = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/dashboard/100123";
    this.Authorization = "MzE0Njl8MDphZG1pbkAxMjM6MTAwMTIz";
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);
  }

  loadenquiry(daterange): Observable<any> {
    this.daterange = daterange;
    return this.http.post(this.url, this.daterange, { headers: this.headers })
      .map(result => result.json());
  }

}
