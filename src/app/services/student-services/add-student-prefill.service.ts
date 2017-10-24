import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers, XHRBackend } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { AuthenticatorService } from '../authenticator.service';

@Injectable()
export class AddStudentPrefillService {

  Authorization: string;
  headers: Headers;
  institute_id: number;

  urlinventory: string = "https://app.proctur.com/StdMgmtWebAPI/api/v1/inventory/item/fetchForStudentAllocationWhileCreation";
  urlCustomComponent: string;

  constructor(private http: Http, private auth: AuthenticatorService) {
    this.Authorization = this.auth.getAuthToken();
    this.institute_id = this.auth.getInstituteId();
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);

  }


  fetchInventoryList() {
    let data = { standard_id: null, subject_id: null };

    return this.http.post(this.urlinventory, data, { headers: this.headers })
      .map(el => {
        return el.json();
      },
      err => {
        console.log('error while loading Inventory, please check your internet connection');
      });
  }



  fetchCustomComponent(){
    this.urlCustomComponent = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/fetchCustomEnquiryComponents/" +this.institute_id +"?id=0&isSearhable=undefined&student_enq_id=&page=2";
    /* return this.http.get(this.urlCustomComponent, {headers: this.headers})
    .map() */
  }
}
