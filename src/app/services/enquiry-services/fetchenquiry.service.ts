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
import { AuthenticatorService } from '../authenticator.service';

@Injectable()
export class FetchenquiryService {

  /* Declare variable */
  instituteData: instituteInfo;
  url: string;
  urlCampaign: string;
  Authorization: string;
  headers: Headers;
  headersCampaign: Headers;
  instituteFormData: any = {};
  row: any = [];
  filtered = [];
  institute_id: number;
  urlDownloadTemplate: string;
  urlDownloadAllEnquiry: string;

  /* initialize the value of variables on service call */
  constructor(private http: Http, private auth: AuthenticatorService) {
    this.Authorization = this.auth.getAuthToken();
    this.institute_id = this.auth.getInstituteId();
    this.url = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/dashboard/" + this.institute_id;
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);
  }


  /* Function to fetch json data for all enquiry as per the input institute data  */
  getAllEnquiry(instituteData: instituteInfo): Observable<EnquiryCampaign[]> {
    this.instituteFormData = JSON.parse(JSON.stringify(instituteData));
    this.urlCampaign = 'https://app.proctur.com/StdMgmtWebAPI/api/v2/enquiry_manager/search/' + this.institute_id;
    this.headersCampaign = new Headers();
    this.headersCampaign.append("Content-Type", "application/json");
    this.headersCampaign.append("Authorization", this.Authorization);
    return this.http.post(this.urlCampaign, this.instituteFormData, { headers: this.headersCampaign })
      .map(res => {
        this.row = res.json();
        return this.row;
      });
  }


  /* return the template user has to edit */
  fetchDownloadTemplate() {
    this.urlDownloadTemplate = "https://app.proctur.com/StdMgmtWebAPI/api/v2/enquiry_manager/download/bulkUploadEnquiriesTemplate";

    return this.http.get(this.urlDownloadTemplate, { headers: this.headers }).map(
      data => { return data.json() },
      err => { console.log("error fetching template"); }
    );
  }



  fetchAllEnquiryAsXls(data) {
    this.urlDownloadAllEnquiry = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/all/download/" +this.institute_id;

    return this.http.post(this.urlDownloadAllEnquiry, data, { headers: this.headers }).map(
      data => { return data.json() },
      err => { console.log("error fetching template"); }
    );
  }

}