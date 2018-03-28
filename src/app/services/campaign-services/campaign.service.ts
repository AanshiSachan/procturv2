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
export class CampaignService {

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
  baseUrl: string = "";

  /* initialize the value of variables on service call */
  constructor(private http: Http, private auth: AuthenticatorService) {
    this.Authorization = this.auth.getAuthToken();
    this.institute_id = this.auth.getInstituteId();
    this.baseUrl = this.auth.getBaseUrl();
    this.url = this.baseUrl + "/api/v1/enquiry/dashboard/" + this.institute_id;
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);

    this.headersEncoded = new Headers();
    this.headersEncoded.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

  }


  /* return the template user has to edit */
  fetchDownloadTemplate() {
    if (this.baseUrl == 'http://test999.proctur.com/StdMgmtWebAPI') {
      this.urlDownloadTemplate = "http://test999.proctur.com/doc/lead_upload_form.xls";
      return this.http.get(this.urlDownloadTemplate).map(
        data => { return data.json() },
        err => {
          //  console.log("error fetching template");
        }
      );
    }
    else {
      this.urlDownloadTemplate = "https://app.proctur.com/doc/lead_upload_form.xls";
      return this.http.get(this.urlDownloadTemplate).map(
        data => { return data.json() },
        err => {
          //  console.log("error fetching template");
        }
      );
    }
  }

  uploadFileStep2(response) {
    let data = response;

    this.urlDownloadAllEnquiry = this.baseUrl + "/api/v1/campaign/list/" + this.institute_id + "/upload";

    return this.http.post(this.urlDownloadAllEnquiry, data, { headers: this.headers }).map(
      data => { return data.json() },
      err => {
        //  console.log("error fetching template"); 
      }
    );

  }


  verifyUploadFileName(name) {

    let data = { campaign_list_name: name };
    console.log(data);

    this.urlDownloadAllEnquiry = this.baseUrl + "/api/v1/campaign/list/" + this.institute_id + "/checkListName";

    return this.http.post(this.urlDownloadAllEnquiry, data, { headers: this.headers }).map(
      data => { return data.json() },
      err => {
        //  console.log("error fetching template"); 
      }
    );
  }

  campaignUploadList(values) {

    values.institute_id = this.institute_id;

    let data = {};
    console.log(data);

    this.urlDownloadAllEnquiry = this.baseUrl + "/api/v1/campaign/list/" + this.institute_id;

    return this.http.post(this.urlDownloadAllEnquiry, data, { headers: this.headers }).map(
      data => { return data.json() },
      err => {
        //  console.log("error fetching template"); 
      }
    );
  }


  campaignMessageList( data) {
    this.urlDownloadAllEnquiry = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id + "/all";

    return this.http.post(this.urlDownloadAllEnquiry, data, { headers: this.headers }).map(
      data => { return data.json() },
      err => {
        return err.json();
      }
    );
  }


  saveSMSservice(data) {
    console.log(data);

    this.urlDownloadAllEnquiry = this.baseUrl + "/api/v1/campaign/create/" + this.institute_id;

    return this.http.post(this.urlDownloadAllEnquiry, data, { headers: this.headers }).map(
      data => { return data.json() },
      err => {
        //  console.log("error fetching template"); 
      }
    );
  }


  campaignSMSTestService(data) {

    this.url = this.baseUrl + "/api/v1/campaign/sendTestSMS/" + this.institute_id;

    return this.http.post(this.url, data, { headers: this.headers }).map(
      data => { return data.json() },
      err => { }
    );
  }


  downloadFailureListFile(campaign_id) {

    this.url = this.baseUrl + "/api/v1/campaign/list/" + this.institute_id + "/download/" + campaign_id;

    return this.http.get(this.url, { headers: this.headers }).map(
      data => { return data.json() },
      err => { }
    );
  }

  deleteMessage(id) {
    let url = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id + "/" + id;
    let obj = {
      status: 400
    };
    return this.http.put(url, obj, { headers: this.headers }).map(
      data => { return data.json() },
      err => { }
    );
  }

  updateMessage(obj, id) {
    let url = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id + "/" + id;
    return this.http.put(url, obj, { headers: this.headers }).map(
      data => { return data.json() },
      err => { }
    );
  }

  addNewMessage(obj) {
    let url = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id;
    return this.http.post(url, obj, { headers: this.headers }).map(
      data => { return data.json() },
      err => { }
    );
  }

  approveMessage(id) {
    let url = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id + "/" + id;
    let obj = {
      status: 1
    }
    return this.http.put(url, obj, { headers: this.headers }).map(
      data => { return data.json() },
      err => { }
    );
  }

}
