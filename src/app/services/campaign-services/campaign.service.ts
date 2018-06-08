import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
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
  headers: any;
  instituteFormData: any = {};
  row: any = [];
  filtered = [];
  institute_id: number;
  urlDownloadTemplate: string;
  urlDownloadAllEnquiry: string;
  urlFetchAllSms: string;
  baseUrl: string = "";

  /* initialize the value of variables on service call */
  constructor(private http: HttpClient, private auth: AuthenticatorService) {
    this.auth.currentAuthKey.subscribe(key => {
      this.Authorization = key;
      this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    })
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });

    this.baseUrl = this.auth.getBaseUrl();
    this.url = this.baseUrl + "/api/v1/enquiry/dashboard/" + this.institute_id;
  }


  /* return the template user has to edit */
  fetchDownloadTemplate() {
    if (this.baseUrl == 'http://test999.proctur.com/StdMgmtWebAPI') {
      this.urlDownloadTemplate = "http://test999.proctur.com/doc/lead_upload_form.xls";
      return this.http.get(this.urlDownloadTemplate).map(
        data => { return data },
        err => { return err }
      );
    }
    else {
      this.urlDownloadTemplate = "https://app.proctur.com/doc/lead_upload_form.xls";
      return this.http.get(this.urlDownloadTemplate).map(
        data => { return data },
        err => { return err; }
      );
    }
  }

  uploadFileStep2(response) {
    let data = response;
    this.urlDownloadAllEnquiry = this.baseUrl + "/api/v1/campaign/list/" + this.institute_id + "/upload";
    return this.http.post(this.urlDownloadAllEnquiry, data, { headers: this.headers }).map(
      data => { return data },
      err => { return err; }
    );
  }

  verifyUploadFileName(name) {
    let data = { campaign_list_name: name };
    this.urlDownloadAllEnquiry = this.baseUrl + "/api/v1/campaign/list/" + this.institute_id + "/checkListName";
    return this.http.post(this.urlDownloadAllEnquiry, data, { headers: this.headers }).map(
      data => { return data },
      err => { return err; }
    );
  }

  campaignUploadList(values) {
    values.institute_id = this.institute_id;
    let data = {};
    this.urlDownloadAllEnquiry = this.baseUrl + "/api/v1/campaign/list/" + this.institute_id;
    return this.http.post(this.urlDownloadAllEnquiry, data, { headers: this.headers }).map(
      data => { return data },
      err => { return err; }
    );
  }

  campaignMessageList(data) {
    this.urlDownloadAllEnquiry = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id + "/all";
    return this.http.post(this.urlDownloadAllEnquiry, data, { headers: this.headers }).map(
      data => { return data },
      err => { return err; }
    );
  }

  saveSMSservice(data) {
    this.urlDownloadAllEnquiry = this.baseUrl + "/api/v1/campaign/create/" + this.institute_id;
    return this.http.post(this.urlDownloadAllEnquiry, data, { headers: this.headers }).map(
      data => { return data },
      err => { return err; }
    );
  }

  campaignSMSTestService(data) {
    this.url = this.baseUrl + "/api/v1/campaign/sendTestSMS/" + this.institute_id;
    return this.http.post(this.url, data, { headers: this.headers }).map(
      data => { return data },
      err => { return err; }
    );
  }

  downloadFailureListFile(campaign_id) {
    this.url = this.baseUrl + "/api/v1/campaign/list/" + this.institute_id + "/download/" + campaign_id;
    return this.http.get(this.url, { headers: this.headers }).map(
      data => { return data },
      err => { return err; }
    );
  }

  deleteMessage(id) {
    let url = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id + "/" + id;
    let obj = {
      status: 400
    };
    return this.http.put(url, obj, { headers: this.headers }).map(
      data => { return data },
      err => { return err; }
    );
  }

  updateMessage(obj, id) {
    let url = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id + "/" + id;
    return this.http.put(url, obj, { headers: this.headers }).map(
      data => { return data },
      err => { return err; }
    );
  }

  addNewMessage(obj) {
    let url = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id;
    return this.http.post(url, obj, { headers: this.headers }).map(
      data => { return data },
      err => { return err; }
    );
  }

  approveMessage(id) {
    let url = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id + "/" + id;
    let obj = {
      status: 1
    }
    return this.http.put(url, obj, { headers: this.headers }).map(
      data => { return data },
      err => { return err; }
    );
  }

  fetchAllSms() {
    this.urlFetchAllSms = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id + "/all";
    let data = {
      feature_type: 2,
      sms_type: "Transactional"
    }
    return this.http.post(this.urlFetchAllSms, data, { headers: this.headers }).map(
      data => { return data },
      err => { return err; }
    );
  }

}
