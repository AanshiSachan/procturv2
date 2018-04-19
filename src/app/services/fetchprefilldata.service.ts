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
import { AuthenticatorService } from './authenticator.service';

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
  addCampaignURL: string; //url for adding a lead
  getCampaignsURL: string; //url for getting Campaigns
  baseUrl: string = '';
  Authorization: string;
  headers: Headers;
  headersPost: Headers;
  institute_id: number;

  /* set default value for each url, header and autherization on service creation */
  constructor(private http: Http, private auth: AuthenticatorService) {
    this.auth.currentAuthKey.subscribe( key => {
      this.Authorization = key;
      this.headers = new Headers();
      this.headers.append("Content-Type", "application/json");
      this.headers.append("Authorization", this.Authorization);
      this.baseUrl = this.auth.getBaseUrl();
      this.headersPost = new Headers();
      this.headersPost.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    }) 
    this.auth.currentInstituteId.subscribe( id => {
      this.institute_id = id;
    });
    // this.Authorization = this.auth.getAuthToken();
    // this.institute_id = this.auth.getInstituteId();

  }



  getAllFinancialYear() {
    let url = this.baseUrl + "/api/v1/academicYear/all/" + this.institute_id;

    return this.http.get(url, { headers: this.headers }).map(
      res => { return res.json(); },
      err => { return err.json(); }
    )
  }



  /* fetch prefill data assigned to */
  getAssignTo(): any {

    this.urlAssignTo = this.baseUrl + "/api/v1/profiles/" + this.institute_id;

    let content = JSON.stringify({ "user_Type": 0 });
    return this.http.post(this.urlAssignTo, content, { headers: this.headers })
      .map(res => {
        return res.json()
      });
  }





  /* fetch prefill data scholarship */
  /*  getScholarPrefillData(): any {
 
     this.urlScholarSub = this.baseUrl + "/api/v1/enquiry/fetchCustomEnquiryComponents/" +this.institute_id +"?id=0&isSearhable=Y&page=1";
 
     return this.http.get(this.urlScholarSub, { headers: this.headers })
       .map(res => {
         return res.json();
       })
   } */





  /* fetch prefill data status */
  getEnqStatus(): any {

    this.urlEnqsta = this.baseUrl + "/api/v2/enquiry_manager/getEnquiryStatuses";

    return this.http.get(this.urlEnqsta, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }





  /* fetch prefill data priority*/
  getEnqPriority(): any {

    this.urlEnqPri = this.baseUrl + "/api/v1/masterData/type/ENQ_PRIORITY";

    return this.http.get(this.urlEnqPri, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }





  /* fetch prefill data followup type*/
  getFollowupType(): any {

    this.urlFollType = this.baseUrl + "/api/v1/masterData/type/ENQ_FOLLOW_TYPE";

    return this.http.get(this.urlFollType, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }




  /* fetch prefill data standards*/
  getEnqStardards(): any {

    this.urlStdSub = this.baseUrl + "/api/v1/standards/all/" + this.institute_id + "?active=Y";

    return this.http.get(this.urlStdSub, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }




  /* fetch prefill data subjects*/
  getEnqSubjects(id): any {

    this.urlSubject = this.baseUrl + "/api/v1/subjects/standards/" + id;
    return this.http.get(this.urlSubject, { headers: this.headers }).map(res => {
      return res.json();
    })
  }




  /* return the list of institute name and their respective ID */
  getSchoolDetails(): any {

    this.urlSchool = this.baseUrl + "/api/v1/schools/all/" + this.institute_id + "?active=Y";

    return this.http.get(this.urlSchool, { headers: this.headers })
      .map(res => {
        return res.json();
      },
        err => {
          return err.json();
        })
  }




  /* fetch prefill data source*/
  getLeadSource(): any {

    this.urlLeadSource = this.baseUrl + "/api/v1/enquiry_campaign/master/lead_source/" + this.institute_id + "/all";

    return this.http.get(this.urlLeadSource, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }





  /* fetch prefill data reference*/
  getLeadReffered() {

    this.urlLeadReffered = this.baseUrl + "/api/v1/enquiry_campaign/master/lead_referred_by/" + this.institute_id + "/all";

    return this.http.get(this.urlLeadReffered, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }

  getCampaignsList() {
    this.getCampaignsURL = this.baseUrl + "/api/v1/campaign/list/" + this.institute_id;
    return this.http.post(this.getCampaignsURL, {}, { headers: this.headers })
      .map(res => {
        return res.json();
      },
        err => {
          return err.json();
        })
  }

  /* Send a post request to add a lead*/
  addCampaignPostRequest(data): any {

    this.addCampaignURL = this.baseUrl + "/api/v1/campaign/list/" + this.institute_id + "/createLead";

    let addCampaignForm: any = {
      address: data.address,
      city: data.city,
      email: data.email,
      gender: data.gender,
      mobile: data.phone,
      name: data.name,
      referred_by: data.referred,
      source_id: data.source
    };
    let responseData: any;
    return this.http.post(this.addCampaignURL, addCampaignForm, { headers: this.headers }).map(res => {
      responseData = res.json();

      return responseData;
    });
  }




  /* fetch prefill data occupation*/
  getOccupation(): any {

    this.urlOccupation = this.baseUrl + "/api/v1/enquiry_campaign/master/occupation/" + this.institute_id + "/all";

    return this.http.get(this.urlOccupation, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }




  /* fetch prefill data last enquiry form data uploaded*/
  fetchLastDetail(): any {

    this.urlLastDetail = this.baseUrl + "/api/v1/enquiry/" + this.institute_id + "/fetchLastEnquiryDetails";

    return this.http.get(this.urlLastDetail, { headers: this.headers })
      .map(res => {
        return res.json();
      });
  }




  /* fetch prefill data as per the lead information provided */
  fetchLeadDetails(number): any {
    this.urlLeadDetails = this.baseUrl + "/api/v1/campaign/getLeadDetailsForMobileNo/" + this.institute_id + "/" + number;

    return this.http.get(this.urlLeadDetails, { headers: this.headers })
      .map(res => {
        return res.json();
      })
  }




  /* function to create new institute */
  createNewInstitute(data) {
    this.urlInstituteCreate = this.baseUrl + '/api/v1/schools';
    let newInstituteForm: any = {
      school_name: data.instituteName,
      is_active: data.isActive,
      institution_id: this.institute_id.toString(),
    };
    let responseData: any;
    return this.http.post(this.urlInstituteCreate, newInstituteForm, { headers: this.headers }).map(res => {
      responseData = res.json();

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

    this.urlSubmitNewEnquiry = this.baseUrl + "/api/v1/enquiry/" + this.institute_id;

    return this.http.post(this.urlSubmitNewEnquiry, newFormData, { headers: this.headers }).map(res => {
      responseData = res.json();
      return responseData;
    });
  }





  /* function to create new source */
  createSource(data) {
    let response: any = null;
    this.urlAddSource = this.baseUrl + "/api/v1/enquiry_campaign/master/lead_source";
    return this.http.post(this.urlAddSource, data, { headers: this.headers }).map(res => {
      response = res.json();
      return response;
    })
  }




  /* function to create new reference */
  createReferer(data) {
    let response: any = null;
    this.urlAddReferer = this.baseUrl + "/api/v1/enquiry_campaign/master/lead_referred_by";
    return this.http.post(this.urlAddReferer, data, { headers: this.headers }).map(res => {
      response = res.json();
      return response;
    })
  }




  /* fetch payment modes */
  fetchPaymentModes() {

    this.urlPaymentModes = this.baseUrl + "/api/v2/enquiry_manager/getAllConfiguredEnquiryFeePaymentModes";

    return this.http.get(this.urlPaymentModes, { headers: this.headers }).map(
      data => { return data.json() },
    )
  }




  /* Fetch comments for the selected enquiryID */
  fetchCommentsForEnquiry(id) {
    this.urlFetchComments = this.baseUrl + "/api/v1/enquiry/comments/" + this.institute_id + "/" + id;
    return this.http.get(this.urlFetchComments, { headers: this.headers })
      .map(data => {
        return data.json();
      })
  }




  /* Fetch comments for the selected enquiryID */
  fetchAllDataEnquiry(id) {
    this.urlFetchComments = this.baseUrl + "/api/v1/enquiry/v2/" + this.institute_id + "/" + id;
    return this.http.get(this.urlFetchComments, { headers: this.headers })
      .map(data => {
        return data.json();
      })
  }





  /* return the list of custom component for the selected institute ID */
  fetchCustomComponentEmpty(): Observable<any> {
    this.urlCustomComponent = this.baseUrl + "/api/v1/enquiry/fetchCustomEnquiryComponents/" + this.institute_id + "?id=0&isSearhable=undefined&page=1";
    return this.http.get(this.urlCustomComponent, { headers: this.headers })
      .map(
        data => {
          if (data['_body'] != '') {
            return data.json();
          }
          else {
            return [];
          }
        },
        err => {
          return err.json();
        }
      );
  }




  /* return the list of custom component for the selected institute ID */
  fetchCustomComponentById(id): any {
    this.urlCustomComponent = this.baseUrl + "/api/v1/enquiry/fetchCustomEnquiryComponents/" + this.institute_id + "?id=" + id + "&isSearhable=undefined&page=1";
    return this.http.get(this.urlCustomComponent, { headers: this.headers })
      .map(
        data => {
          if (data['_body'] != '') {
            return data.json();
          }
          else {
            return [];
          }
        },
        err => {
        }
      );
  }



  /* return the data for user selected list to be edited */
  fetchEnquiryByInstituteID(id): any {
    this.urlEnquiryByID = this.baseUrl + "/api/v1/enquiry/" + this.institute_id + "/" + id;

    return this.http.get(this.urlEnquiryByID, { headers: this.headers }).map(res => {
      return res.json();
    },
      err => {
      });
  }


  fetchRegistrationFeeDetails() {
    let urlRegistrationFeeDetail = this.baseUrl + "/api/v2/enquiry_manager/fetchInstituteRegistrationFeesDetails";

    let data = {
      institution_id: this.institute_id
    }

    return this.http.post(urlRegistrationFeeDetail, data, { headers: this.headers }).map(
      res => { return res.json() }
    )
  }



  fetchBulkUpdateStatusReport() {

    let urlBulkUpdateStatus = this.baseUrl + "/api/v1/bulkUpload/" + this.institute_id;

    let data = {
      func_type: "enquiryBulkUpload"
    }

    return this.http.post(urlBulkUpdateStatus, data, { headers: this.headers }).map(
      res => { return res.json() }
    )
  }


  fetchComponentGenerator() {

    let urlComponentGenerator = this.baseUrl + '/api/v1/masterData/type/CUSTOM_COMPONENT_TYPE';

    return this.http.get(urlComponentGenerator, { headers: this.headers }).map(
      res => { return res.json() }
    );
  }


  fetchUserCreatedComponent() {

    let urlUserComponent = this.baseUrl + "/api/v1/instCustomComp/getAll/" + this.institute_id + "?page=1";

    return this.http.get(urlUserComponent, { headers: this.headers }).map(
      res => {
        return res.json();
      }
    );

  }


  getEnquirySlots() {
    let urlSlots = this.baseUrl + "/api/v1/inst_slot/all/" + this.institute_id;

    return this.http.get(urlSlots, { headers: this.headers }).map(
      res => {
        return res.json();
      },
      err => {
        return err.json();
      }
    )
  }


  // Get City LIst

  getCityList() {
    let urlSlots = this.baseUrl + "/api/v1/cityArea/" + this.institute_id + "/all";

    return this.http.get(urlSlots, { headers: this.headers }).map(
      res => {
        return res.json();
      },
      err => {
        return err.json();
      }
    )
  }

  getAreaList(obj) {
    obj.main_branch_instId = this.institute_id;
    let urlSlots = this.baseUrl + "/api/v1/cityArea/" + this.institute_id;
    return this.http.post(urlSlots, obj, { headers: this.headers }).map(
      res => {
        return res.json();
      },
      err => {
        return err.json();
      }
    )
  }


}
