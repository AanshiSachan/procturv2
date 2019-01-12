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
export class FetchenquiryService {

  /* Declare variable */
  instituteData: instituteInfo;
  url: string;
  urlCampaign: string;
  Authorization: string;
  headers: any;
  headersEncoded: any;
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
      this.headers = new HttpHeaders(
        { "Content-Type": "application/json", "Authorization": this.Authorization });
      this.headersEncoded = new HttpHeaders(
        { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Authorization": this.Authorization });
    });
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.baseUrl = this.auth.getBaseUrl();
    this.url = this.baseUrl + "/api/v1/enquiry/dashboard/" + this.institute_id;

  }


  /* Function to fetch json data for all enquiry as per the input institute data  */
  getAllEnquiry(obj) {
    /* Admin has requested for enquiry */

    if (sessionStorage.getItem('permissions') == null || sessionStorage.getItem('permissions') == undefined || sessionStorage.getItem('permissions') == '' || sessionStorage.getItem('username') == 'admin') {
      obj.followUpDate = (obj.followUpDate == '' || obj.followUpDate == null) ? '' : moment(obj.followUpDate).format('YYYY-MM-DD');
      obj.enquiry_date = (obj.enquiry_date == '' || obj.enquiry_date == null) ? '' : moment(obj.enquiry_date).format('YYYY-MM-DD');
      obj.enquireDateFrom = (obj.enquireDateFrom == '' || obj.enquireDateFrom == null) ? '' : moment(obj.enquireDateFrom).format('YYYY-MM-DD');
      obj.enquireDateTo = (obj.enquireDateTo == '' || obj.enquireDateTo == null) ? '' : moment(obj.enquireDateTo).format('YYYY-MM-DD');
      obj.updateDate = (obj.updateDate == '' || obj.updateDate == null) ? '' : moment(obj.updateDate).format('YYYY-MM-DD');
      obj.updateDateFrom = (obj.updateDateFrom == '' || obj.updateDateFrom == null) ? '' : moment(obj.updateDateFrom).format('YYYY-MM-DD');
      obj.updateDateTo = (obj.updateDateTo == '' || obj.updateDateTo == null) ? '' : moment(obj.updateDateTo).format('YYYY-MM-DD');
      this.urlCampaign = this.baseUrl + '/api/v2/enquiry_manager/search/' + this.institute_id;
      return this.http.post(this.urlCampaign, obj, { headers: this.headers })
        .map(res => {
          this.row = res;
          return this.row;
        });
    }
    else {
      let permissions: any[] = [];
      permissions = JSON.parse(sessionStorage.getItem('permissions'));
      /* User has permission to view all enquiries */
      if (permissions.includes('115') || (permissions.includes('110') && sessionStorage.getItem('open_enq_Visibility_feature') == '1')) {
        obj.followUpDate = (obj.followUpDate == '' || obj.followUpDate == null) ? '' : moment(obj.followUpDate).format('YYYY-MM-DD');
        obj.enquiry_date = (obj.enquiry_date == '' || obj.enquiry_date == null) ? '' : moment(obj.enquiry_date).format('YYYY-MM-DD');
        obj.enquireDateFrom = (obj.enquireDateFrom == '' || obj.enquireDateFrom == null) ? '' : moment(obj.enquireDateFrom).format('YYYY-MM-DD');
        obj.enquireDateTo = (obj.enquireDateTo == '' || obj.enquireDateTo == null) ? '' : moment(obj.enquireDateTo).format('YYYY-MM-DD');
        obj.updateDate = (obj.updateDate == '' || obj.updateDate == null) ? '' : moment(obj.updateDate).format('YYYY-MM-DD');
        obj.updateDateFrom = (obj.updateDateFrom == '' || obj.updateDateFrom == null) ? '' : moment(obj.updateDateFrom).format('YYYY-MM-DD');
        obj.updateDateTo = (obj.updateDateTo == '' || obj.updateDateTo == null) ? '' : moment(obj.updateDateTo).format('YYYY-MM-DD');
        this.urlCampaign = this.baseUrl + '/api/v2/enquiry_manager/search/' + this.institute_id;

        return this.http.post(this.urlCampaign, obj, { headers: this.headers })
          .map(res => {
            this.row = res;
            return this.row;
          });
      }
      /* User is not authorized as enquiry admin and see only enquiry assigned to him */
      else {
        obj.followUpDate = (obj.followUpDate == '' || obj.followUpDate == null) ? '' : moment(obj.followUpDate).format('YYYY-MM-DD');
        obj.enquiry_date = (obj.enquiry_date == '' || obj.enquiry_date == null) ? '' : moment(obj.enquiry_date).format('YYYY-MM-DD');
        obj.enquireDateFrom = (obj.enquireDateFrom == '' || obj.enquireDateFrom == null) ? '' : moment(obj.enquireDateFrom).format('YYYY-MM-DD');
        obj.enquireDateTo = (obj.enquireDateTo == '' || obj.enquireDateTo == null) ? '' : moment(obj.enquireDateTo).format('YYYY-MM-DD');
        obj.updateDate = (obj.updateDate == '' || obj.updateDate == null) ? '' : moment(obj.updateDate).format('YYYY-MM-DD');
        obj.updateDateFrom = (obj.updateDateFrom == '' || obj.updateDateFrom == null) ? '' : moment(obj.updateDateFrom).format('YYYY-MM-DD');
        obj.updateDateTo = (obj.updateDateTo == '' || obj.updateDateTo == null) ? '' : moment(obj.updateDateTo).format('YYYY-MM-DD');
        obj.assigned_to = sessionStorage.getItem('userid');
        this.urlCampaign = this.baseUrl + '/api/v2/enquiry_manager/search/' + this.institute_id;

        return this.http.post(this.urlCampaign, obj, { headers: this.headers })
          .map(res => {
            this.row = res;
            return this.row;
          });
      }
    }
  }

    /* return the template user has to edit */
    fetchEnquiryStudentData(instituteID,id) {
      this.urlDownloadTemplate = this.baseUrl + "/api/v1/enquiry/"+instituteID+"/"+id;
  
      return this.http.get(this.urlDownloadTemplate, { headers: this.headers }).map(
        data => { return data },
        err => { return err; }
      );
    }

  /* return the template user has to edit */
  fetchDownloadTemplate() {
    this.urlDownloadTemplate = this.baseUrl + "/api/v2/enquiry_manager/download/bulkUploadEnquiriesTemplate";

    return this.http.get(this.urlDownloadTemplate, { headers: this.headers }).map(
      data => { return data },
      err => { return err; }
    );
  }


  /* return the json to construct a list of student enquiry to xls */
  fetchAllEnquiryAsXls(obj) {
    obj.enquireDateFrom = obj.enquireDateFrom == 'Invalid date' ? "" : obj.enquireDateFrom;
    obj.enquireDateTo = obj.enquireDateTo == 'Invalid date' ? "" : obj.enquireDateTo;
    obj.enquiry_date = obj.enquiry_date == 'Invalid date' ? "" : obj.enquiry_date;
    obj.updateDateFrom = obj.updateDateFrom == 'Invalid date' ? "" : obj.updateDateFrom;
    obj.updateDateTo = obj.updateDateTo == 'Invalid date' ? "" : obj.updateDateTo;
    obj.updateDate = obj.updateDate == 'Invalid date' ? "" : obj.updateDate;
    obj.followUpDate = obj.followUpDate == 'Invalid date' ? "" : obj.followUpDate;
    this.urlDownloadAllEnquiry = this.baseUrl + "/api/v1/enquiry/all/download/" + this.institute_id;

    return this.http.post(this.urlDownloadAllEnquiry, obj, { headers: this.headers }).map(
      data => { return data },
      err => {
        return err;
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
      res => { return res }
    );

  }



  fetchBulkReport(id) {
    let urlEnquiryBulkReport = this.baseUrl + "/api/v1/bulkUpload/" + this.institute_id + "/download/" + id;

    return this.http.get(urlEnquiryBulkReport, { headers: this.headers }).map(
      res => {
        return res;
      }
    )
  }



  fetchReceiptPdf(num) {

    let urlPdf = this.baseUrl + "/api/v2/enquiry_manager/downloadRegistrationFeesReceipt/" + num;

    return this.http.get(urlPdf, { headers: this.headers }).map(
      res => {
        return res;
      }
    )
  }


  fetchEnquiryWidgetView(obj) {

    let url = this.baseUrl + "/api/v1/enquiry/dashboard/" + this.institute_id;
    return this.http.post(
      url, obj, { headers: this.headers }
    ).map(
      res => { return res; },
      err => { return err; }
    )
  }


  // Download Report Summary

  getSummaryReportOfThisMonth() {
    let url = this.baseUrl + "/api/v1/enquiry_manager/download_summary_report/" + this.institute_id + "/this_month/NA";
    return this.http.post(
      url, {}, { headers: this.headers }
    ).map(
      res => { return res; },
      err => { return err; }
    )
  }

  getPreviousMSummary() {
    let url = this.baseUrl + "/api/v1/enquiry_manager/download_summary_report/" + this.institute_id + "/prev_month/NA";
    return this.http.post(
      url, {}, { headers: this.headers }
    ).map(
      res => { return res; },
      err => { return err; }
    )
  }


  getSummaryReportOfLastTwoMonth() {
    let url = this.baseUrl + "/api/v1/enquiry_manager/download_summary_report/" + this.institute_id + "/last_two_months/NA";
    return this.http.post(
      url, {}, { headers: this.headers }
    ).map(
      res => { return res; },
      err => { return err; }
    )
  }

  getSummaryReportFromDates(obj) {
    let url = this.baseUrl + "/api/v1/enquiry_manager/download_summary_report/" + this.institute_id + "/" + obj.from_date + "/" + obj.to_date;
    return this.http.post(
      url, {}, { headers: this.headers }
    ).map(
      res => { return res; },
      err => { return err; }
    )
  }

}