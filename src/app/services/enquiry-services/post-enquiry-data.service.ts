import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers, RequestOptions } from '@angular/http';
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
  baseUrl:string = '';

  /* Instantiate http Object at load */
  constructor(private http: Http, private auth: AuthenticatorService) {
    this.Authorization = this.auth.getAuthToken();
    this.institute_id = this.auth.getInstituteId();
    this.baseUrl = this.auth.getBaseUrl();
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);
  }




  updateEnquiryForm(id, data) {

    data.followUpDate = moment(data.followUpDate).format('YYYY-MM-DD');
    data.commentDate = moment(data.commentDate).format('YYYY-MM-DD');

    this.urlUpdateEnquiryForm = this.baseUrl + "/api/v1/enquiry/status/" + this.institute_id + "/" + id;

    return this.http.put(this.urlUpdateEnquiryForm, data, { headers: this.headers }).map(res => {
      return res.json();  
    });
  }




  deleteEnquiryById(id) {
    this.urlDeleteById = this.baseUrl + "/api/v1/enquiry/delete/" + this.institute_id + "/" + id;
    this.headers.append("X-Requested-With", "XMLHttpRequest");
    return this.http.delete(this.urlDeleteById, { headers: this.headers }).map(res => {
      data => { return data.json };
    });
  }




  updateRegisterationPayment(data) {
    this.urlRegisterPayment = this.baseUrl + "/api/v2/enquiry_manager/payRegistrationFees";
    return this.http.post(this.urlRegisterPayment, data, { headers: this.headers }).map(data => {
      return data.json();
    });
  }





  editFormUpdater(id, data) {
    data.enquiry_date = moment(data.enquiry_date).format('YYYY-MM-DD');
    data.followUpDate = moment(data.followUpDate).format('YYYY-MM-DD') == "Invalid date" ? '': moment(data.followUpDate).format('YYYY-MM-DD');
    data.dob = moment(data.dob).format('YYYY-MM-DD') == "Invalid date"? '': moment(data.dob).format('YYYY-MM-DD');
    this.urlEditFormUpdater = this.baseUrl + "/api/v1/enquiry/" + this.institute_id + "/" + id;
    return this.http.put(this.urlEditFormUpdater, data, { headers: this.headers })
      .map(data => {
        return data.json();
      });
  }




  postNewEnquiry(data) {
    data.enquiry_date = moment(data.enquiry_date).format('YYYY-MM-DD');
    data.followUpDate = moment(data.followUpDate).format('YYYY-MM-DD') == "Invalid date" ? '': moment(data.followUpDate).format('YYYY-MM-DD');
    data.dob = moment(data.dob).format('YYYY-MM-DD') == "Invalid date"? '': moment(data.dob).format('YYYY-MM-DD');
    this.urlPostEnquiry = this.baseUrl + "/api/v1/enquiry/" + this.institute_id;
    return this.http.post(this.urlPostEnquiry, data, { headers: this.headers }).map(
      data => { return data.json(); }
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
          console.log(xhr.response);
        } else {
          console.log(xhr.response);
        }
      }
    }
    xhr.send(formdata);

  }




  addNewSmsTemplate(msg) {
    this.urlUploadSmsTemplate = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id;

    return this.http.post(this.urlUploadSmsTemplate, msg, { headers: this.headers }).map(
      res => {
        return res.json()
      },
      err => { }
    );
  }





  saveEditedSms(id, data) {

    let urlEditedSms = this.baseUrl + "/api/v1/campaign/message/" + this.institute_id + '/' + id

    return this.http.put(urlEditedSms, data, { headers: this.headers }).map(
      res => { return res.json(); }
    )

  }




  sendSmsToEnquirer(data) {

    let urlSendSmsToEnquirer = this.baseUrl + "/api/v1/enquiry_manager/sendSMS/" + this.institute_id;

    return this.http.post(urlSendSmsToEnquirer, data, { headers: this.headers }).map(
      res => { return res.json() }
    )
  }




  deleteEnquiryBulk(data) {

    let urlDeleteBulk = this.baseUrl + '/api/v1/enquiry/' + this.institute_id + '/bulkDeleteEnquiries';

    let options = new RequestOptions(
      {
        headers: this.headers,
        body: data
      }
    );

    return this.http.delete(urlDeleteBulk, options).map(
      res => { return res.json(); }
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
      res => { return res.json(); }
    )

  }




  deleteInstitute(id) {

    let urlInstituteDeleter = this.baseUrl + "/api/v1/schools/" + id;

    return this.http.delete(urlInstituteDeleter, { headers: this.headers }).map(
      res => { return res.json(); }
    )
  }




  updateSourceDetails(data) {

    let urlUpdateSource = this.baseUrl + "/api/v1/enquiry_campaign/master/lead_source";

    return this.http.put(urlUpdateSource, data, { headers: this.headers }).map(
      res => {
        return res.json();
      }
    )

  }




  deleteSource(data) {
    let urlDelete = this.baseUrl + "/api/v1/enquiry_campaign/master/lead_source";

    let options = new RequestOptions(
      {
        headers: this.headers,
        body: data
      }
    );

    return this.http.delete(urlDelete, options).map(
      res => {
        return res.json();
      }
    )

  }




  updateReferDetails(data) {

    let urlUpdateRefer = this.baseUrl + "/api/v1/enquiry_campaign/master/lead_referred_by";

    return this.http.put(urlUpdateRefer, data, { headers: this.headers }).map(
      res => {
        return res.json();
      }
    )

  }



  

  deleteRefer(data) {
    let urlDelete = this.baseUrl + "/api/v1/enquiry_campaign/master/lead_referred_by";

    let options = new RequestOptions(
      {
        headers: this.headers,
        body: data
      }
    );

    return this.http.delete(urlDelete, options).map(
      res => {
        return res.json();
      }
    )
  }





  addNewCustomComponent(req) {

    let urlCreateCustomComponent = this.baseUrl + "/api/v1/instCustomComp/create";

    return this.http.post(urlCreateCustomComponent, req, { headers: this.headers }).map(
      res => { return res.json() }
    )

  }





  deleteCustomComponent(id) {

    let urlDeleteCustomComponent = this.baseUrl + "/api/v1/instCustomComp/delete/" + this.institute_id + "/" + id;

    return this.http.delete(urlDeleteCustomComponent, { headers: this.headers }).map(
      res => { return res.json() }
    );
  }




  updateCustomComponent(req) {

    let data = {
      comp_length: req.comp_length,
      component_id: req.component_id,
      description: req.description,
      institution_id: this.institute_id,
      is_required: req.is_required,
      is_searchable: req.is_searchable,
      label: req.label,
      page: req.page,
      prefilled_data: req.prefilled_data,
      sequence_number: req.sequence_number,
      type: req.type,
    }

    let urlUpdateCustomComponent = this.baseUrl + "/api/v1/instCustomComp/update";

    return this.http.put(urlUpdateCustomComponent, data, { headers: this.headers }).map(
      res => {
        return res.json();
      }
    );

  }




  setEnquiryAssignee(form){

    let urlSetAssignee = this.baseUrl +"/api/v1/enquiry_manager/assign/" +this.institute_id;

    return this.http.post(urlSetAssignee, form, {headers: this.headers}).map(
      res => {
        return res.json();
      },
      err => {
        return err.json();
      }

    )
  }


}