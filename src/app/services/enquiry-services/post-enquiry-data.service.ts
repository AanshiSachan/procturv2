import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/Rx';
import * as moment from 'moment';
import { AuthenticatorService } from '../authenticator.service'
import { Http, Response, Request, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class PostEnquiryDataService {

  /* Variable declaration */
  urlUpdateEnquiryForm: string;
  urlDeleteById: string;
  urlRegisterPayment: string;
  urlEditFormUpdater: string;
  urlPostEnquiry: string;
  urlPostXlsDocument: string;
  urlUploadSmsTemplate: string;

  Authorization: string;
  headers: any;
  headerFormData: Headers;
  institute_id: number;
  baseUrl: string = '';

  /* Instantiate http Object at load */
  constructor(
    private httpOnly: Http,
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
    // this.Authorization = this.auth.getAuthToken();
    // this.institute_id = this.auth.getInstituteId();
    this.baseUrl = this.auth.getBaseUrl();
  }

  updateEnquiryForm(id, data) {
    data.followUpDate = moment(data.followUpDate).format('YYYY-MM-DD');
    data.commentDate = moment(data.commentDate).format('YYYY-MM-DD');
    this.urlUpdateEnquiryForm = this.baseUrl + "/api/v1/enquiry/status/" + this.institute_id + "/" + id;
    return this.http.put(this.urlUpdateEnquiryForm, data, { headers: this.headers }).map(res => {
      return res;
    });
  }

  deleteEnquiryById(id) {
    this.urlDeleteById = this.baseUrl + "/api/v1/enquiry/delete/" + this.institute_id + "/" + id;
    this.headers.append("X-Requested-With", "XMLHttpRequest");
    return this.http.delete(this.urlDeleteById, { headers: this.headers }).map(res => {
      data => { return data };
    });
  }

  updateRegisterationPayment(data) {
    this.urlRegisterPayment = this.baseUrl + "/api/v2/enquiry_manager/payRegistrationFees";
    return this.http.post(this.urlRegisterPayment, data, { headers: this.headers }).map(data => {
      return data;
    });
  }

  editFormUpdater(id, data) {
    data.enquiry_date = moment(data.enquiry_date).format('YYYY-MM-DD');
    data.followUpDate = moment(data.followUpDate).format('YYYY-MM-DD') == "Invalid date" ? '' : moment(data.followUpDate).format('YYYY-MM-DD');

    this.urlEditFormUpdater = this.baseUrl + "/api/v1/enquiry/" + this.institute_id + "/" + id;
    return this.http.put(this.urlEditFormUpdater, data, { headers: this.headers })
      .map(data => {
        return data;
      });
  }

  postNewEnquiry(data) {
    data.enquiry_date = moment(data.enquiry_date).format('YYYY-MM-DD');
    data.followUpDate = moment(data.followUpDate).format('YYYY-MM-DD') == "Invalid date" ? '' : moment(data.followUpDate).format('YYYY-MM-DD');
    data.dob = moment(data.dob).format('YYYY-MM-DD') == "Invalid date" ? '' : moment(data.dob).format('YYYY-MM-DD');
    this.urlPostEnquiry = this.baseUrl + "/api/v1/enquiry/" + this.institute_id;
    return this.http.post(this.urlPostEnquiry, data, { headers: this.headers }).map(
      data => { return data }
    );
  }

  uploadEnquiryXls(file) {

    this.urlPostXlsDocument = this.baseUrl + "/api/v2/enquiry_manager/bulkUploadEnquiries";
    let formdata = new FormData();
    formdata.append("file", file);
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("POST", this.urlPostXlsDocument, true);

    xhr.setRequestHeader("processData", "false");
    xhr.setRequestHeader("contentType", "false");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.setRequestHeader("enctype", "multipart/form-data");
    xhr.setRequestHeader("Authorization", this.Authorization);

    //Call function when onload.
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status === 200) {

        } else {

        }
      }
    }
    xhr.send(formdata);
  }

  addNewSmsTemplate(msg) {
    this.urlUploadSmsTemplate = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id;
    return this.http.post(this.urlUploadSmsTemplate, msg, { headers: this.headers }).map(
      res => {
        return res
      },
      err => { return err }
    );
  }

  saveEditedSms(id, data) {
    let urlEditedSms = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id + '/' + id
    return this.http.put(urlEditedSms, data, { headers: this.headers }).map(
      res => { return res; }
    )
  }

  sendSmsToEnquirer(data) {
    let urlSendSmsToEnquirer = this.baseUrl + "/api/v1/enquiry_manager/sendSMS/" + this.institute_id;
    return this.http.post(urlSendSmsToEnquirer, data, { headers: this.headers }).map(
      res => { return res }
    )
  }

  deleteEnquiryBulk(data) {
    let urlDeleteBulk = this.baseUrl + '/api/v1/enquiry/' + this.institute_id + '/bulkDeleteEnquiries';
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", this.Authorization);
    let options = new RequestOptions(
      {
        headers: headers,
        body: data
      }
    );
    return this.httpOnly.delete(urlDeleteBulk, options).map(
      res => { return res; }
    )
  }

  updateInstituteDetails(id, req) {
    let urlInstituteUpdater = this.baseUrl + "/api/v1/schools/" + id;
    let data = {
      school_name: req.school_name,
      is_active: "Y",
      institution_id: this.institute_id
    }
    return this.http.put(urlInstituteUpdater, data, { headers: this.headers }).map(
      res => { return res; }
    )
  }

  deleteInstitute(id) {
    let urlInstituteDeleter = this.baseUrl + "/api/v1/schools/" + id;
    return this.http.delete(urlInstituteDeleter, { headers: this.headers }).map(
      res => { return res; }
    )
  }

  updateSourceDetails(data) {
    let urlUpdateSource = this.baseUrl + "/api/v1/enquiry_campaign/master/lead_source";
    return this.http.put(urlUpdateSource, data, { headers: this.headers }).map(
      res => {
        return res;
      }
    )
  }

  deleteRefer(data) {
    let urlDelete = this.baseUrl + "/api/v1/enquiry_campaign/master/lead_referred_by";

    let head = new Headers({ "Content-Type": "application/json", "Authorization": this.Authorization });

    let options = new RequestOptions(
      {
        headers: head,
        body: data
      }
    );

    return this.httpOnly.delete(urlDelete, options).map(
      res => {
        return res;
      }
    )
  }

  deleteSource(data) {
    let urlDelete = this.baseUrl + "/api/v1/enquiry_campaign/master/lead_source";

    let head = new Headers({ "Content-Type": "application/json", "Authorization": this.Authorization });

    let options = new RequestOptions(
      {
        headers: head,
        body: data
      }
    );

    return this.httpOnly.delete(urlDelete, options).map(
      res => {
        return res;
      }
    )

  }

  updateReferDetails(data) {
    let urlUpdateRefer = this.baseUrl + "/api/v1/enquiry_campaign/master/lead_referred_by";
    return this.http.put(urlUpdateRefer, data, { headers: this.headers }).map(
      res => {
        return res;
      }
    )

  }



  addNewCustomComponent(req) {
    let urlCreateCustomComponent = this.baseUrl + "/api/v1/instCustomComp/create";
    return this.http.post(urlCreateCustomComponent, req, { headers: this.headers }).map(
      res => { return res },
      err => { return err }
    )
  }

  deleteCustomComponent(id) {
    let urlDeleteCustomComponent = this.baseUrl + "/api/v1/instCustomComp/delete/" + this.institute_id + "/" + id;
    return this.http.delete(urlDeleteCustomComponent, { headers: this.headers }).map(
      res => { return res },
      err => { return err }
    );
  }

  updateCustomComponent(req) {
    req.institution_id = this.institute_id;
    let urlUpdateCustomComponent = this.baseUrl + "/api/v1/instCustomComp/update";
    return this.http.put(urlUpdateCustomComponent, req, { headers: this.headers }).map(
      res => {
        return res;
      },
      err => { return err }
    );

  }

  setEnquiryAssignee(form) {
    let urlSetAssignee = this.baseUrl + "/api/v1/enquiry_manager/assign/" + this.institute_id;
    return this.http.post(urlSetAssignee, form, { headers: this.headers }).map(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )
  }


}