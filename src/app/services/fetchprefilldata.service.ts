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

  /* Variable Declaration to urls and headers */

  urlAssignTo: string;  // assigned to
  urlScholarSub: string;  // scholarship
  urlEnqsta: string;   // enquiry status
  urlFollType: string;  // enquiry follow up
  urlEnqPri: string;   // enquiry priority
  urlStdSub: string;   // enquiry standard 
  urlSubject: string;   // enquiry subject 
  urlSchool: string;  // institute details
  urlLeadSource: string;  //  source
  urlLeadReffered: string;  // reffered by
  urlOccupation: string;   // occupation details
  urlLastDetail: string;  // last added data
  urlLeadDetails: string;   // fetch lead details
  urlInstituteCreate: string;   //  create new institute
  urlSubmitNewEnquiry: string;   // submit new enquiry 
  urlAddSource: string;  // add new source
  urlAddReferer: string;   // add new reference
  urlPaymentModes: string;  // payment methods
  urlFetchComments: string; // fetch data for update enquiry

  Authorization: string; 
  headers: Headers; 
  headersPost: Headers;
  institute_id: number = 100123;


  /* set default value for each url, header and autherization on service creation */
  constructor(private http: Http) {
    this.urlSubmitNewEnquiry = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/100123";
    this.urlAssignTo = "https://app.proctur.com/StdMgmtWebAPI/api/v1/profiles/100123";
    this.urlScholarSub = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/fetchCustomEnquiryComponents/100123?id=0&isSearhable=Y&page=1";
    this.urlEnqsta = "https://app.proctur.com/StdMgmtWebAPI/api/v2/enquiry_manager/getEnquiryStatuses";
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
    this.urlPaymentModes = "https://app.proctur.com/StdMgmtWebAPI/api/v2/enquiry_manager/getAllConfiguredEnquiryFeePaymentModes";

    this.Authorization = "MzE0Njl8MDphZG1pbkAxMjM6MTAwMTIz";
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);

    this.headersPost = new Headers();
    this.headersPost.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  }

  /* fetch prefill data assigned to */
  getAssignTo(): any {
    let content = JSON.stringify({ "user_Type": 0 });
    return this.http.post(this.urlAssignTo, content, { headers: this.headers })
      .map(res => {
        return res.json()
      });
  }

  /* fetch prefill data scholarship */  
  getScholarPrefillData(): any {
    return this.http.get(this.urlScholarSub, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data status */  
  getEnqStatus(): any {
    return this.http.get(this.urlEnqsta, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data priority*/  
  getEnqPriority(): any {
    return this.http.get(this.urlEnqPri, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data followup type*/  
  getFollowupType(): any {
    return this.http.get(this.urlFollType, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data standards*/  
  getEnqStardards(): any {
    return this.http.get(this.urlStdSub, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data subjects*/  
  getEnqSubjects(id): any {
    console.log(id);
    this.urlSubject = "https://app.proctur.com/StdMgmtWebAPI/api/v1/subjects/standards/" + id;
    return this.http.get(this.urlSubject, { headers: this.headers }).map(res => {
      return res.json();
    })
  }

  /* fetch prefill data institute name*/  
  getSchoolDetails(): any {
    return this.http.get(this.urlSchool, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data source*/  
  getLeadSource(): any {
    return this.http.get(this.urlLeadSource, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data reference*/  
  getLeadReffered(): any {
    return this.http.get(this.urlLeadReffered, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data occupation*/  
  getOccupation(): any {
    return this.http.get(this.urlLeadReffered, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data last enquiry form data uploaded*/  
  fetchLastDetail(): any {
    return this.http.get(this.urlLastDetail, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data as per the lead information provided */  
  fetchLeadDetails(number): any {
    this.urlLeadDetails = "https://app.proctur.com/StdMgmtWebAPI/api/v1/campaign/getLeadDetailsForMobileNo/" + this.institute_id + number;
    //console.log(this.urlLeadDetails);
    return this.http.get(this.urlLeadDetails, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* function to create new institute */  
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

  /* function to create new enquiry */    
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

  /* function to create new source */    
  createSource(data) {
    let response: any = null;
    return this.http.post(this.urlAddSource, data, { headers: this.headers }).map(res => {
      response = res.json();
      return response;
    })
  }

  /* function to create new reference */    
  createReferer(data) {
    let response: any = null;
    return this.http.post(this.urlAddReferer, data, { headers: this.headers }).map(res => {
      response = res.json();
      return response;
    })
  }

  /* fetch payment modes */
  fetchPaymentModes(){
    return this.http.get(this.urlPaymentModes, {headers: this.headers}).map(
      data => {return data.json()},
      err => {alert(err.json())})
  }

  /* Fetch comments for the selected enquiryID */
  fetchCommentsForEnquiry(id){
    this.urlFetchComments = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/comments/100123/" +id;
    return this.http.get(this.urlFetchComments, {headers: this.headers})
    .map(data => {
      return data.json();
    })}

}
