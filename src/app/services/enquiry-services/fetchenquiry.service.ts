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
  baseUrl: string = "http://test999.proctur.com/StdMgmtWebAPI";

  /* initialize the value of variables on service call */
  constructor(private http: Http, private auth: AuthenticatorService) {
    this.Authorization = this.auth.getAuthToken();
    this.institute_id = this.auth.getInstituteId();
    this.url = this.baseUrl + "/api/v1/enquiry/dashboard/" + this.institute_id;
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);

    this.headersEncoded = new Headers();
    this.headersEncoded.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

  }


  /* Function to fetch json data for all enquiry as per the input institute data  */
  getAllEnquiry(obj) {

    obj.followUpDate = obj.followUpDate == '' ? '' : moment(obj.followUpDate).format('YYYY-MM-DD');
    obj.enquiry_date = obj.enquiry_date == '' ? '' : moment(obj.enquiry_date).format('YYYY-MM-DD');
    obj.enquireDateFrom = obj.enquireDateFrom == '' ? '' : moment(obj.enquireDateFrom).format('YYYY-MM-DD');
    obj.enquireDateTo = obj.enquireDateTo == '' ? '' : moment(obj.enquireDateTo).format('YYYY-MM-DD');
    obj.updateDate = obj.updateDate == '' ? '' : moment(obj.updateDate).format('YYYY-MM-DD');
    obj.updateDateFrom = obj.updateDateFrom == '' ? '' : moment(obj.updateDateFrom).format('YYYY-MM-DD');
    obj.updateDateTo = obj.updateDateTo == '' ? '' : moment(obj.updateDateTo).format('YYYY-MM-DD');

    this.urlCampaign = this.baseUrl + '/api/v2/enquiry_manager/search/' + this.institute_id;

    return this.http.post(this.urlCampaign, obj, { headers: this.headers })
      .map(res => {
        this.row = res.json();
        return this.row;
      });
  }


  /* return the template user has to edit */
  fetchDownloadTemplate() {
    this.urlDownloadTemplate = this.baseUrl + "/api/v2/enquiry_manager/download/bulkUploadEnquiriesTemplate";

    return this.http.get(this.urlDownloadTemplate, { headers: this.headers }).map(
      data => { return data.json() },
      err => {
        //  console.log("error fetching template");
      }
    );
  }


  /* return the json to construct a list of student enquiry to xls */
  fetchAllEnquiryAsXls(data) {
    this.urlDownloadAllEnquiry = this.baseUrl + "/api/v1/enquiry/all/download/" + this.institute_id;

    return this.http.post(this.urlDownloadAllEnquiry, data, { headers: this.headers }).map(
      data => { return data.json() },
      err => {
        //  console.log("error fetching template"); 
      }
    );
  }


  fetchAllSms() {


    this.urlFetchAllSms = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id + "/all";

    let data = {
      feature_type: 2,
      sms_type: "Transactional"
    }


    return this.http.post(this.urlFetchAllSms, data, { headers: this.headers }).map(
      res => { return res.json() }
    );

  }



  fetchBulkReport(id) {
    let urlEnquiryBulkReport = this.baseUrl + "/api/v1/bulkUpload/" + this.institute_id + "/download/" + id;

    return this.http.get(urlEnquiryBulkReport, { headers: this.headers }).map(
      res => {
        return res.json();
      }
    )
  }

  

  fetchReceiptPdf(num){

    let urlPdf = this.baseUrl +"/api/v2/enquiry_manager/downloadRegistrationFeesReceipt/" + num;

   return this.http.get(urlPdf, {headers: this.headers}).map(
      res => {
        return res.json();
      }
    )
  }

}