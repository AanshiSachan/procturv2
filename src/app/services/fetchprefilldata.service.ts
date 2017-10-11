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

@Injectable()
export class FetchprefilldataService {

  urlAssignTo: string; urlScholarSub: string; urlEnqsta: string; urlFollType: string;
  urlEnqPri: string; urlStdSub: string; urlSubject: string; urlSchool: string;
  urlLeadSource: string; urlLeadReffered: string; urlOccupation: string; urlLastDetail: string;
  urlLeadDetails: string; urlInstituteCreate: string; urlSubmitNewEnquiry: string; urlAddSource: string;
  urlAddReferer: string; Authorization: string; headers: Headers; headersPost: Headers;
  institute_id: number = 100123;


  constructor(private http: Http) {
    this.urlSubmitNewEnquiry = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/100123";
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
    this.urlAddSource = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry_campaign/master/lead_source";
    this.urlAddReferer = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry_campaign/master/lead_referred_by";

    this.Authorization = "MzE0Njl8MDphZG1pbkAxMjM6MTAwMTIz";
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);

    this.headersPost = new Headers();
    this.headersPost.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
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

  getEnqStatus(): any {
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

  getEnqStardards(): any {
    return this.http.get(this.urlStdSub, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  getEnqSubjects(id): any {
    console.log(id);
    this.urlSubject = "https://app.proctur.com/StdMgmtWebAPI/api/v1/subjects/standards/" + id;
    return this.http.get(this.urlSubject, { headers: this.headers }).map(res => {
      return res.json();
    })
  }

  getSchoolDetails(): any {
    return this.http.get(this.urlSchool, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  getLeadSource(): any {
    return this.http.get(this.urlLeadSource, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  getLeadReffered(): any {
    return this.http.get(this.urlLeadReffered, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  getOccupation(): any {
    return this.http.get(this.urlLeadReffered, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  fetchLastDetail(): any {
    return this.http.get(this.urlLastDetail, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  fetchLeadDetails(number): any {
    this.urlLeadDetails = "https://app.proctur.com/StdMgmtWebAPI/api/v1/campaign/getLeadDetailsForMobileNo/" + this.institute_id + number;
    //console.log(this.urlLeadDetails);
    return this.http.get(this.urlLeadDetails, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  createNewInstitute(data) {
    this.urlInstituteCreate = 'https://app.proctur.com/StdMgmtWebAPI/api/v1/schools';
    let newInstituteForm: any = {
      school_name: data.instituteName,
      is_active: data.isActive,
      institution_id: "100123",
    };
    let responseData: any;
    return this.http.post(this.urlInstituteCreate, newInstituteForm, { headers: this.headers }).map(res => {
      responseData = res.json();
      //console.log(responseData);
      return responseData;
    });
  }

  postNewEnquiry(data) {
    let responseData: any;
    let newFormData = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      gender: data.gender,
      phone2: data.phone2,
      email2: data.email2,
      curr_address: data.curr_address,
      parent_name: data.parent_name,
      parent_phone: data.parent_phone,
      parent_email: data.parent_email,
      city: data.city,
      occupation_id: "-1",
      school_id: data.institution_id,
      qualification: "",
      grade: "",
      enquiry_date: data.enquiry_date,
      standard_id: data.standard_id,
      subject_id: data.subject_id,
      referred_by: data.referred_by,
      source_id: data.source_id,
      fee_committed: data.fee_committed,
      discount_offered: data.discount_offered,
      priority: data.priority,
      enquiry: data.enquiry,
      follow_type: data.follow_type,
      followUpDate: data.followUpDate,
      religion: null,
      link: data.link,
      slot_id: null,
      closedReason: "",
      demo_by_id: "",
      status: data.status,
      assigned_to: data.assigned_to,
      followUpTime: "",
      lead_id: -1
    }
    return this.http.post(this.urlSubmitNewEnquiry, newFormData, { headers: this.headers }).map(res => {
      responseData = res.json();
      return responseData;
    });
  }

  createSource(data) {
    let response: any = null;
    return this.http.post(this.urlAddSource, data, { headers: this.headers }).map(res => {
      response = res.json();
      return response;
    })
  }

  createReferer(data) {
    let response: any = null;
    return this.http.post(this.urlAddReferer, data, { headers: this.headers }).map(res => {
      response = res.json();
      return response;
    })
  }
}
