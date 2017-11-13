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
  headersEncoded: Headers;
  instituteFormData: any = {};
  row: any = [];
  filtered = [];
  institute_id: number;
  urlDownloadTemplate: string;
  urlDownloadAllEnquiry: string;
  urlFetchAllSms: string;
  baseUrl:string = "http://test999.proctur.com/StdMgmtWebAPI";

  /* initialize the value of variables on service call */
  constructor(private http: Http, private auth: AuthenticatorService) {
    this.Authorization = this.auth.getAuthToken();
    this.institute_id = this.auth.getInstituteId();
    this.url = this.baseUrl +"/api/v1/enquiry/dashboard/" + this.institute_id;
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);

    this.headersEncoded = new Headers();
    this.headersEncoded.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    
  }


  /* Function to fetch json data for all enquiry as per the input institute data  */
  getAllEnquiry(instituteData: instituteInfo): Observable<EnquiryCampaign[]> {
    this.instituteFormData = JSON.parse(JSON.stringify(instituteData));
    this.urlCampaign = this.baseUrl +'/api/v2/enquiry_manager/search/' + this.institute_id;

    return this.http.post(this.urlCampaign, this.instituteFormData, { headers: this.headers })
      .map(res => {
        this.row = res.json();
        return this.row;
      });
  }


  /* return the template user has to edit */
  fetchDownloadTemplate() {
    this.urlDownloadTemplate = this.baseUrl +"/api/v2/enquiry_manager/download/bulkUploadEnquiriesTemplate";

    return this.http.get(this.urlDownloadTemplate, { headers: this.headers }).map(
      data => { return data.json() },
      err => { 
      //  console.log("error fetching template");
       }
    );
  }


  /* return the json to construct a list of student enquiry to xls */
  fetchAllEnquiryAsXls(data) {
    this.urlDownloadAllEnquiry = this.baseUrl +"/api/v1/enquiry/all/download/" +this.institute_id;

    return this.http.post(this.urlDownloadAllEnquiry, data, { headers: this.headers }).map(
      data => { return data.json() },
      err => { 
      //  console.log("error fetching template"); 
      }
    );
  }


  fetchAllSms(){
    this.urlFetchAllSms = 'http://test999.proctur.com/CampaignServlet';

    let data = {
      institute_id: this.institute_id,
      function_type: 'fetch_campaign_messages',
      username: sessionStorage.getItem('userid') +'|' +sessionStorage.getItem('userType'),
      password: sessionStorage.getItem('password'),
      feature_type: 2
    }


    let dataString = `institute_id=${data.institute_id}&function_type=${data.function_type}&username=${data.username}&password=${data.password}&feature_type=${data.feature_type}`;

    return this.http.post(this.urlFetchAllSms, dataString, {headers: this.headersEncoded}).map(
      res=> { return res.json().aaData;}
    )
  }


  
}