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
import {AuthenticatorService} from './authenticator.service';

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
  urlCustomComponent: string; //url for custom component
  urlEnquiryByID: string; //url for enquiry edit data

  Authorization: string; 
  headers: Headers; 
  headersPost: Headers;
  institute_id: number;


  /* set default value for each url, header and autherization on service creation */
  constructor(private http: Http, private auth: AuthenticatorService) {
    this.Authorization = this.auth.getAuthToken();
    //console.log(this.Authorization);
    this.institute_id = this.auth.getInstituteId();
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);

    this.headersPost = new Headers();
    this.headersPost.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  }

  /* fetch prefill data assigned to */
  getAssignTo(): any {

    this.urlAssignTo = "https://app.proctur.com/StdMgmtWebAPI/api/v1/profiles/" +this.institute_id;

    let content = JSON.stringify({ "user_Type": 0 });
    return this.http.post(this.urlAssignTo, content, { headers: this.headers })
      .map(res => {
        return res.json()
      });
  }

  /* fetch prefill data scholarship */  
  getScholarPrefillData(): any {

    this.urlScholarSub = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/fetchCustomEnquiryComponents/" +this.institute_id +"?id=0&isSearhable=Y&page=1";

    return this.http.get(this.urlScholarSub, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data status */  
  getEnqStatus(): any {

    this.urlEnqsta = "https://app.proctur.com/StdMgmtWebAPI/api/v2/enquiry_manager/getEnquiryStatuses";

    return this.http.get(this.urlEnqsta, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data priority*/  
  getEnqPriority(): any {

    this.urlEnqPri = "https://app.proctur.com/StdMgmtWebAPI/api/v1/masterData/type/ENQ_PRIORITY";

    return this.http.get(this.urlEnqPri, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data followup type*/  
  getFollowupType(): any {

    this.urlFollType = "https://app.proctur.com/StdMgmtWebAPI/api/v1/masterData/type/ENQ_FOLLOW_TYPE";

    return this.http.get(this.urlFollType, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data standards*/  
  getEnqStardards(): any {

    this.urlStdSub = "https://app.proctur.com/StdMgmtWebAPI/api/v1/standards/all/" +this.institute_id +"?active=Y";

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

  /* return the list of institute name and their respective ID */  
  getSchoolDetails(): any {

    this.urlSchool = "https://app.proctur.com/StdMgmtWebAPI/api/v1/schools/all/" +this.institute_id +"?active=Y";

    return this.http.get(this.urlSchool, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data source*/  
  getLeadSource(): any {

    this.urlLeadSource = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry_campaign/master/lead_source/" +this.institute_id +"/all";

    return this.http.get(this.urlLeadSource, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data reference*/  
  getLeadReffered(): any {

    this.urlLeadReffered = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry_campaign/master/lead_referred_by/" +this.institute_id +"/all";

    return this.http.get(this.urlLeadReffered, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data occupation*/  
  getOccupation(): any {

    this.urlOccupation = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry_campaign/master/occupation/" +this.institute_id +"/all";

    return this.http.get(this.urlOccupation, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  /* fetch prefill data last enquiry form data uploaded*/  
  fetchLastDetail(): any {

    this.urlLastDetail = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/" +this.institute_id +"/fetchLastEnquiryDetails";

    return this.http.get(this.urlLastDetail, { headers: this.headers })
      .map(res => {
        return res.json();
      });
  }

  /* fetch prefill data as per the lead information provided */  
  fetchLeadDetails(number): any {
    this.urlLeadDetails = "https://app.proctur.com/StdMgmtWebAPI/api/v1/campaign/getLeadDetailsForMobileNo/" + this.institute_id +"/" + number;
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
      institution_id: this.institute_id.toString(),
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

    this.urlSubmitNewEnquiry = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/" +this.institute_id;

    return this.http.post(this.urlSubmitNewEnquiry, newFormData, { headers: this.headers }).map(res => {
      responseData = res.json();
      return responseData;
    });
  }



  /* function to create new source */    
  createSource(data) {
    let response: any = null;
    this.urlAddSource = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry_campaign/master/lead_source";
    return this.http.post(this.urlAddSource, data, { headers: this.headers }).map(res => {
      response = res.json();
      return response;
    })
  }



  /* function to create new reference */    
  createReferer(data) {
    let response: any = null;
    this.urlAddReferer = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry_campaign/master/lead_referred_by";
    return this.http.post(this.urlAddReferer, data, { headers: this.headers }).map(res => {
      response = res.json();
      return response;
    })
  }



  /* fetch payment modes */
  fetchPaymentModes(){

    this.urlPaymentModes = "https://app.proctur.com/StdMgmtWebAPI/api/v2/enquiry_manager/getAllConfiguredEnquiryFeePaymentModes";

    return this.http.get(this.urlPaymentModes, {headers: this.headers}).map(
      data => {return data.json()},
      err => {alert(err.json())})
  }



  /* Fetch comments for the selected enquiryID */
  fetchCommentsForEnquiry(id){
    this.urlFetchComments = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/comments/" +this.institute_id +"/" +id;
    return this.http.get(this.urlFetchComments, {headers: this.headers})
    .map(data => {
      return data.json();
    })
  }



  /* return the list of custom component for the selected institute ID */
  fetchCustomComponent(): any{
    this.urlCustomComponent = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/fetchCustomEnquiryComponents/" +this.institute_id +"?id=0&isSearhable=undefined&page=1";
    return this.http.get(this.urlCustomComponent, {headers: this.headers})
    .map(
      data => {return data.json();},
      err => { console.log("an error occurred while fetching custom component for student add view");}
    );
  }



  /* return the data for user selected list to be edited */
  fetchEnquiryByInstituteID(id): any{

    this.urlEnquiryByID = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/" +this.institute_id +"/" +id;

    return this.http.get(this.urlEnquiryByID, {headers: this.headers}).map(res => {
      return res.json();
    },
    err => {
      console.log("error loading row Data to Edit, please try again later");
    })

  }


}
