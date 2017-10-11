import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers, XHRBackend } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { instituteInfo } from '../../model/instituteinfo';
import { EnquiryCampaign } from '../../model/enquirycampaign';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { Subscription } from 'rxjs';
import * as moment from 'moment';


@Injectable()
export class FetchenquiryService {

  instituteData: instituteInfo;
  url: string; 
  urlCampaign: string;
  Authorization: string; 
  headers: Headers; 
  headersCampaign: Headers; 

  instituteFormData: any = {}; 
  row: any = []; 
  filtered = [];
  daterange = {
    updateDateFrom: moment().startOf('month').format('YYYY-MM-DD'),
    updateDateTo: moment().format('YYYY-MM-DD'),
  };

  constructor(private http: Http) {

    this.Authorization = "MzE0Njl8MDphZG1pbkAxMjM6MTAwMTIz";
    this.url = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/dashboard/100123";
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);
  }

  getAllEnquiry(instituteData: instituteInfo): Observable<EnquiryCampaign[]> {
    this.instituteFormData = JSON.parse(JSON.stringify(instituteData));
    console.log(this.instituteFormData);
    this.urlCampaign = 'https://app.proctur.com/StdMgmtWebAPI/api/v2/enquiry_manager/search/100123';
    this.headersCampaign = new Headers();
    this.headersCampaign.append("Content-Type", "application/json");
    this.headersCampaign.append("Authorization", this.Authorization);
    return this.http.post(this.urlCampaign, this.instituteFormData, { headers: this.headersCampaign })
      .map(res => {
        this.row = res.json();
        return this.row;
      });
  }


}