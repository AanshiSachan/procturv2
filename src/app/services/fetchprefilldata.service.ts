import { Injectable } from '@angular/core';
import { Http, Response, Request, Headers, XHRBackend } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { instituteInfo } from '../model/instituteinfo';
import { EnquiryCampaign } from '../model/enquirycampaign';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/Rx';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import {NgbModal, NgbModalOptions, NgbActiveModal,  ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { EnquiryConfirmModalComponent } from '../components/custom/enquiry-confirm-modal/enquiry-confirm-modal.component';

@Injectable()
export class FetchprefilldataService {

  urlAssignTo: string; 
  urlScholarSub: string;
  urlEnqsta: string; 
  urlFollType: string; 
  urlEnqPri: string; 
  urlStdSub: string; 
  urlSubject: string;
  urlSchool: string;
  urlLeadSource: string;
  urlLeadReffered: string;
  urlOccupation: string;
  urlLastDetail: string;
  urlLeadDetails: string;
  Authorization: string; 
  headers: Headers; 
 
  constructor(private http: Http, private modalService: NgbModal) { 

    this.urlAssignTo = "https://app.proctur.com/StdMgmtWebAPI/api/v1/profiles/100123";
    this.urlScholarSub = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/fetchCustomEnquiryComponents/100123?id=0&isSearhable=Y&page=1";
    this.urlEnqsta = "https://app.proctur.com/StdMgmtWebAPI/api/v1/masterData/type/SPEC_ENQUIRY_STATUS";
    this.urlEnqPri = "https://app.proctur.com/StdMgmtWebAPI/api/v1/masterData/type/ENQ_PRIORITY";
    this.urlFollType = "https://app.proctur.com/StdMgmtWebAPI/api/v1/masterData/type/ENQ_FOLLOW_TYPE";
    this.urlStdSub = "https://app.proctur.com/StdMgmtWebAPI/api/v1/standards/all/100123?active=Y";
    this.urlSchool = "https://app.proctur.com/StdMgmtWebAPI/api/v1/schools/all/100123?active=Y";
    this.urlLeadSource = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry_campaign/master/lead_source/100123/all";
    this.urlLeadReffered = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry_campaign/master/lead_referred_by/100123/all";
    this.urlOccupation = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry_campaign/master/occupation/100123/all";
    this.urlLastDetail = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/100123/fetchLastEnquiryDetails";
    this.urlLeadDetails = "https://app.proctur.com/StdMgmtWebAPI/api/v1/campaign/getLeadDetailsForMobileNo/100123/"
    this.Authorization = "MzE0Njl8MDphZG1pbkAxMjM6MTAwMTIz";

    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);
  }

  getAssignTo(): any {
    let content = JSON.stringify({ "user_Type": 0 });
    return this.http.post(this.urlAssignTo, content, { headers: this.headers })
      .map(res => {
        return res.json()
      });
  }

  getScholarPrefillData(): any {
    return this.http.get(this.urlScholarSub, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  getEnqStatus(): any{
    return this.http.get(this.urlEnqsta, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  getEnqPriority(): any {
    return this.http.get(this.urlEnqPri, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  getFollowupType(): any {
    return this.http.get(this.urlFollType, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  getEnqStardards(): any{
    return this.http.get(this.urlStdSub, { headers: this.headers })
    .map(res => {
      return res.json();
    })
  }

  getEnqSubjects(id): any{
    console.log(id);
    this.urlSubject= "https://app.proctur.com/StdMgmtWebAPI/api/v1/subjects/standards/" +id;
    return this.http.get(this.urlSubject, {headers: this.headers}).map(res => {
      return res.json();
    })
  }

  getSchoolDetails(): any{
    return this.http.get(this.urlSchool, { headers: this.headers })
    .map(res => {
      return res.json();
    })
  }

  getLeadSource(): any{
    return this.http.get(this.urlLeadSource, { headers: this.headers })
    .map(res => {
      return res.json();
    })
  }

  getLeadReffered(): any{
    return this.http.get(this.urlLeadReffered, { headers: this.headers })
    .map(res => {
      return res.json();
    })
  }
  
  getOccupation(): any{
    return this.http.get(this.urlLeadReffered, { headers: this.headers })
    .map(res => {
      return res.json();
    })
  }

  fetchLastDetail(): any{
    return this.http.get(this.urlLastDetail, { headers: this.headers })
    .map(res => {
      return res.json();
    })
  }

  fetchLeadDetails(number): any{
    this.urlLeadDetails +=number;
    console.log(this.urlLeadDetails);
    return this.http.get(this.urlLeadDetails, { headers: this.headers })
    .map(res => {
      return res.json();
    })
  }

  confirm(){
    const modalRef = this.modalService.open(EnquiryConfirmModalComponent);
  }
  
}
