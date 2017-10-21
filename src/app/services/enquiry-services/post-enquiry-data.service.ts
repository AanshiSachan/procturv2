import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers } from '@angular/http';
/* import { instituteInfo } from '../model/instituteinfo';
import { EnquiryCampaign } from '../model/enquirycampaign';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { Subscription } from 'rxjs';
import * as moment from 'moment'; */
import {AuthenticatorService} from '../authenticator.service'

@Injectable()
export class PostEnquiryDataService {

  /* Variable declaration */
  urlUpdateEnquiryForm: string;
  urlDeleteById: string;
  urlRegisterPayment: string;


  Authorization: string; 
  headers: Headers; 
  institute_id: number;


  /* Instantiate http Object at load */
  constructor(private http: Http, private auth: AuthenticatorService) {
    this.Authorization = this.auth.getAuthToken();
    this.institute_id = this.auth.getInstituteId();
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);
  }

  updateEnquiryForm(id, data){
    this.urlUpdateEnquiryForm = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/status/" +this.institute_id +"/" +id;

    return this.http.put(this.urlUpdateEnquiryForm, data, { headers: this.headers }).map(res => {
      return res.json();
    });
  }


  deleteEnquiryById(id){
    this.urlDeleteById = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/delete/" +this.institute_id +"/" +id;
    this.headers.append("X-Requested-With", "XMLHttpRequest");
    return this.http.delete(this.urlDeleteById, {headers: this.headers}).map(res => {
      data => { return data.json};
    });
  }

  updateRegisterationPayment(data){
    this.urlRegisterPayment = "https://app.proctur.com/StdMgmtWebAPI/api/v2/enquiry_manager/payRegistrationFees";
    return this.http.post(this.urlRegisterPayment, data, {headers: this.headers}).map(data => {
      return data.json();
    });
  }
  
}
