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
export class InventoryService {

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

  fetchAllItems(){
    this.url = this.baseUrl + "/api/v1/inventory/item/all/" + this.institute_id;

    return this.http.get(this.url, {headers: this.headers}).map(
      data => {return data.json() },
      err => {
        //  console.log("error fetching template");
      }
    );
  }


  fetchAllCategories(){
    this.url = this.baseUrl + "/api/v1/inventory/category/all/" + this.institute_id;

    return this.http.get(this.url, {headers: this.headers}).map(
      data => {return data.json() },
      err => {
        //  console.log("error fetching template");
      }
    );
  }


  updateInventoryItem(data){
    this.url = this.baseUrl + "/api/v1/inventory/category/all/" + this.institute_id;

    data.institute_id = this.institute_id;

    return this.http.post(this.url, data,{headers: this.headers}).map(
      data => {return data.json() },
      err => {
      }
    );
  }

}
