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

  private urlinventory: string;
  private urlCustomComponent: string;
  private urlBatchData: string;
  private urlFeeStructure: string;
  private urlFeeSchedule: string;
  private urlFeeInstallment: string;
  private urlAdditionalFeeDetails: string;
  baseUrl: string = "http://test999.proctur.com/StdMgmtWebAPI";

  constructor(private http: Http, private auth: AuthenticatorService) {
    this.Authorization = this.auth.getAuthToken();
    this.institute_id = this.auth.getInstituteId();
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);
  }



  /* return the list of inventory arcticles required by the student */
  fetchInventoryList(): any {
    this.urlinventory = this.baseUrl + "/api/v1/inventory/item/fetchForStudentAllocationWhileCreation";
    let data = { standard_id: null, subject_id: null };

    return this.http.post(this.urlinventory, data, { headers: this.headers })
      .map(el => {
        return el.json();
      },
      err => {
        //console.log('error while loading Inventory, please check your internet connection');
      });
  }


  /* return the list of custom component for the selected institute ID */
  fetchCustomComponent(): any {
    this.urlCustomComponent = this.baseUrl + "/api/v1/enquiry/fetchCustomEnquiryComponents/" + this.institute_id + "?id=0&isSearhable=undefined&student_enq_id=&page=2";
    return this.http.get(this.urlCustomComponent, { headers: this.headers })
      .map(
      data => { return data.json(); },
      err => {
        //console.log("an error occurred while fetching custom component for student add view");
      }
      );
  }



  /* return the list of custom component for the selected institute ID */
  fetchCustomComponentById(id): any {
    this.urlCustomComponent = this.baseUrl + "/api/v1/enquiry/fetchCustomEnquiryComponents/" + this.institute_id + "?id=" + id + "&isSearhable=undefined&student_enq_id=&page=2";
    return this.http.get(this.urlCustomComponent, { headers: this.headers })
      .map(
      data => { return data.json(); },
      err => {
        //console.log("an error occurred while fetching custom component for student add view");
      }
      );
  }



  /* return the list of batch for students  */
  fetchBatchDetails(): any {
    this.urlBatchData = this.baseUrl + "/api/v1/batches/all/" + this.institute_id + "?active=Y"

    return this.http.get(this.urlBatchData, { headers: this.headers })
      .map(
      data => { return data.json(); },
      err => {
        // console.log("there was an error fetching batch data for student add view");
      }
      );
  }


  /* return the list of Fee Structure */
  fetchFeeStructure(): any {
    this.urlFeeStructure = this.baseUrl + "/api/v1/student_wise/feeStructure/fetchAll/" + this.institute_id;

    return this.http.get(this.urlFeeStructure, { headers: this.headers })
      .map(
      data => { return data.json(); },
      err => {
        //console.log("there is an error fetching fee structures, please check your internet connection");
      })
  }



  /* return list of fee schedule for students */
  fetchFeeSchedule(): any {

    this.urlFeeSchedule = this.baseUrl + "/api/v1/studentWise/fee/schedule/fetch/" + this.institute_id + "/-1";

    return this.http.get(this.urlFeeSchedule, { headers: this.headers })
      .map(
      data => { return data.json(); },
      err => {
        //console.log("there is an error fetching fee schedule, please check your internet connection");
      }
      )
  }



  /* return installment data for selected fee structure */
  fetchFeeInstallmentDetails(id, data) {
    this.urlFeeInstallment = this.baseUrl + "/api/v1/student_wise/feeStructure/fetch/" + this.institute_id + "/" + id;

    return this.http.post(this.urlFeeInstallment, data, { headers: this.headers })
      .map(
      data => { return data.json(); },
      err => {
        // console.log("error fetching installment data, please check your internet connection");
      }
      )
  }


  /* return the details for additional fee selected for student  */
  fetchAdditionalFeesInfo(id) {
    this.urlAdditionalFeeDetails = this.baseUrl + "/api/v1/batchFeeSched/feeType/" + id + "/details";
    return this.http.get(this.urlAdditionalFeeDetails, { headers: this.headers })
      .map(
      data => { return data.json(); },
      err => {
        //console.log("error fetching additional fee details, please check your internet connection");
      }
      )
  }


  fetchSlots() {
    let urlFetchSlot = this.baseUrl + "/api/v1/inst_slot/all/" + this.institute_id;

    return this.http.get(urlFetchSlot, { headers: this.headers }).map(
      res => { return res.json(); }
    )
  }


  fetchLangStudentStatus() {
    let urlLangStatus = this.baseUrl + "/api/v1/masterData/type/LANG_STUDENT_STATUS";

    return this.http.get(urlLangStatus, { headers: this.headers }).map(
      res => { return res.json(); }
    )
  }


  fetchLangbatch() {
    let urlLangBatch = this.baseUrl + "/api/v1/batches/all/" + this.institute_id + "?active=Y";

    return this.http.get(urlLangBatch, { headers: this.headers }).map(
      res => { return res.json(); }
    )
  }



  fetchCourseList(id) {

    let urlCourses = this.baseUrl + "/api/v1/subjects/standards/" + id;

    return this.http.get(urlCourses, { headers: this.headers }).map(
      res => { return res.json(); }
    )

  }


  fetchMasterCourse() {
    let urlMaster = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/all";

    return this.http.get(urlMaster, { headers: this.headers }).map(
      res => { return res.json(); }
    )

  }


  fetchAllFeeStructure() {
    let urlFeeStruc = this.baseUrl + "/api/v1/student_wise/feeStructure/fetchAll/" + this.institute_id;

    return this.http.get(urlFeeStruc, { headers: this.headers }).map(
      res => {
        return res.json();
      },
      err => {
        return err.json();
      });
  }


  getFeeStructureById(id, obj) {

    let urlFeebyId = this.baseUrl + "/api/v1/student_wise/feeStructure/fetch/" + this.institute_id + "/" + id;

    return this.http.post(urlFeebyId, obj, { headers: this.headers }).map(
      res => {
        return res.json();
      },
      err => {
        return err.json();
      });
  }
}
