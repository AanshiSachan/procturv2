import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers } from '@angular/http';
import 'rxjs/Rx';
import * as moment from 'moment';
import { AuthenticatorService } from '../authenticator.service'

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
  headers: Headers;
  headerFormData: Headers;
  institute_id: number;
  baseURL: string = "https://app.proctur.com/StdMgmtWebAPI";

  /* Instantiate http Object at load */
  constructor(private http: Http, private auth: AuthenticatorService) {
    this.Authorization = this.auth.getAuthToken();
    this.institute_id = this.auth.getInstituteId();
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);
  }

  updateEnquiryForm(id, data) {
    this.urlUpdateEnquiryForm = this.baseURL +"/api/v1/enquiry/status/" + this.institute_id + "/" + id;

    return this.http.put(this.urlUpdateEnquiryForm, data, { headers: this.headers }).map(res => {
      return res.json();
    });
  }


  deleteEnquiryById(id) {
    this.urlDeleteById = this.baseURL +"/api/v1/enquiry/delete/" + this.institute_id + "/" + id;
    this.headers.append("X-Requested-With", "XMLHttpRequest");
    return this.http.delete(this.urlDeleteById, { headers: this.headers }).map(res => {
      data => { return data.json };
    });
  }

  updateRegisterationPayment(data) {
    this.urlRegisterPayment = this.baseURL +"/api/v2/enquiry_manager/payRegistrationFees";
    return this.http.post(this.urlRegisterPayment, data, { headers: this.headers }).map(data => {
      return data.json();
    });
  }


  editFormUpdater(id, data) {
    this.urlEditFormUpdater = this.baseURL +"/api/v1/enquiry/" + this.institute_id + "/" + id;

    return this.http.put(this.urlEditFormUpdater, data, { headers: this.headers })
      .map(data => {
        return data.json();
      });
  }


  postNewEnquiry(data) {
    this.urlPostEnquiry = this.baseURL +"/api/v1/enquiry/" + this.institute_id;
    return this.http.post(this.urlPostEnquiry, data, { headers: this.headers }).map(
      data => { return data.json(); }
    )
  }



  uploadEnquiryXls(file) {
    
    let formdata = new FormData();
    formdata.append("file", file);

    this.headerFormData = new Headers();
    //this.headerFormData.append("Content-Type", "application/json");
    //this.headerFormData.append("processData", "false");
    this.headerFormData.append("Content-Type", "multipart/form-data");
    this.headerFormData.append("Authorization", this.Authorization);

    this.urlPostXlsDocument = this.baseURL +"/api/v2/enquiry_manager/bulkUploadEnquiries";

    return this.http.post(this.urlPostXlsDocument, formdata, {headers: this.headerFormData}).map(
      res => { return res.json();}
    )

  }


  addNewSmsTemplate(msg){
    this.urlUploadSmsTemplate = "https://app.proctur.com/StdMgmtWebAPI/api/v1/campaign/message/100123";

    return this.http.post(this.urlUploadSmsTemplate, msg, {headers: this.headers}).map(
      res => {return res.json()},
      err => {}
    );
  }
}
