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

  studentFees: any;
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
  baseUrl:string = '';

  

  constructor(private http: Http, private auth: AuthenticatorService) {
    this.Authorization = this.auth.getAuthToken();
    this.institute_id = this.auth.getInstituteId();
    this.baseUrl = this.auth.getBaseUrl();
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);
  }



  /* return the list of inventory arcticles required by the student */
  fetchInventoryList() : Observable<any> {
    this.urlinventory = this.baseUrl + "/api/v1/inventory/item/fetchForStudentAllocationWhileCreation";
    let data = { standard_id: null, subject_id: null };
    return this.http.post(this.urlinventory, data, { headers: this.headers })
      .map(el => {
        return el.json();
      },
      err => {
        return err.json();
      });
  }


  fetchInventoryListById(id) : Observable<any> {
    let urlinventoryByid = this.baseUrl + "/api/v1/inventory/item/fetchForStudentAllocation/" +id;

    return this.http.get(urlinventoryByid , { headers: this.headers }).map(
      el => {
        return el.json();
      },
      err => {
        return err.json();
      });
  }

  fetchInventoryListHistory(id): Observable<any> {

    let urlinventoryHistory = this.baseUrl +'/api/v1/inventory/item/student/txHistory/' +id;

    return this.http.get(urlinventoryHistory, {headers: this.headers}).map(
      res => {
        return res.json();
      },
      err => {
        return err.json();
      }
    )

  }

  /* return the list of custom component for the selected institute ID */
  fetchCustomComponent() : Observable<any> {
    this.urlCustomComponent = this.baseUrl + "/api/v1/enquiry/fetchCustomEnquiryComponents/" + this.institute_id + "?id=0&isSearhable=undefined&student_enq_id=&page=2";
    return this.http.get(this.urlCustomComponent, { headers: this.headers })
      .map(
      data => {
        if(data['_body'] !=''){
          return data.json();
        }
        else{
          return [];
        }
      },
      err => {
        return err.json();
      }
      );
  }



  /* return the list of custom component for the selected institute ID */
  fetchCustomComponentById(id) : Observable<any> {
    this.urlCustomComponent = this.baseUrl + "/api/v1/enquiry/fetchCustomEnquiryComponents/" + this.institute_id + "?id=" + id + "&isSearhable=undefined&student_enq_id=&page=2";
    return this.http.get(this.urlCustomComponent, { headers: this.headers })
      .map(
      data => { 
        if(data['_body'] !=''){
          return data.json();
        }
        else{
          return [];
        } 
      },
      err => {
        return err.json();
      }
      );
  }



  /* return the list of batch for students  */
  fetchBatchDetails() : Observable<any> {
    this.urlBatchData = this.baseUrl + "/api/v1/batches/all/" + this.institute_id + "?active=Y"

    return this.http.get(this.urlBatchData, { headers: this.headers })
      .map(
      data => { return data.json(); },
      err => {
        return err.json();
      }
      );
  }


  /* return the list of Fee Structure */
  fetchFeeStructure() : Observable<any> {
    this.urlFeeStructure = this.baseUrl + "/api/v1/student_wise/feeStructure/fetchAll/" + this.institute_id;

    return this.http.get(this.urlFeeStructure, { headers: this.headers })
      .map(
      data => { return data.json(); },
      err => {
        return err.json();
      })
  }



  /* return list of fee schedule for students */
  fetchFeeSchedule() : Observable<any> {

    this.urlFeeSchedule = this.baseUrl + "/api/v1/studentWise/fee/schedule/fetch/" + this.institute_id + "/-1";

    return this.http.get(this.urlFeeSchedule, { headers: this.headers })
      .map(
      data => { return data.json(); },
      err => {
        return err.json();
      }
      )
  }



  /* return installment data for selected fee structure */
  fetchFeeInstallmentDetails(id, data) : Observable<any> {
    this.urlFeeInstallment = this.baseUrl + "/api/v1/student_wise/feeStructure/fetch/" + this.institute_id + "/" + id;

    return this.http.post(this.urlFeeInstallment, data, { headers: this.headers })
      .map(
      data => { return data.json(); },
      err => {
        return err.json();
      }
      )
  }


  /* return the details for additional fee selected for student  */
  fetchAdditionalFeesInfo(id) : Observable<any> {
    this.urlAdditionalFeeDetails = this.baseUrl + "/api/v1/batchFeeSched/feeType/" + id + "/details";
    return this.http.get(this.urlAdditionalFeeDetails, { headers: this.headers })
      .map(
      data => { return data.json(); },
      err => {
        return err.json();
      }
      )
  }


  fetchSlots() : Observable<any> {
    let urlFetchSlot = this.baseUrl + "/api/v1/inst_slot/all/" + this.institute_id;

    return this.http.get(urlFetchSlot, { headers: this.headers }).map(
      res => { 
        return res.json(); 
      },
      err => {
        return err.json();
      }
    )
  }


  fetchLangStudentStatus() : Observable<any> {
    let urlLangStatus = this.baseUrl + "/api/v1/masterData/type/LANG_STUDENT_STATUS";

    return this.http.get(urlLangStatus, { headers: this.headers }).map(
      res => { return res.json(); },
      err => {
        return err.json();
      }
    )
  }


  fetchLangbatch() : Observable<any> {
    let urlLangBatch = this.baseUrl + "/api/v1/batches/all/" + this.institute_id + "?active=Y";

    return this.http.get(urlLangBatch, { headers: this.headers }).map(
      res => { return res.json(); },
      err => {
        return err.json();
      }
    )
  }



  fetchCourseList(id) : Observable<any> {

    let urlCourses = this.baseUrl + "/api/v1/subjects/standards/" + id;

    return this.http.get(urlCourses, { headers: this.headers }).map(
      res => { return res.json(); },
      err => {
        return err.json();
      }
    )

  }


  fetchMasterCourse() : Observable<any> {
    let urlMaster = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/all";
    return this.http.get(urlMaster, { headers: this.headers }).map(
      res => { return res.json(); },
      err => {
        return err.json();
      }
    )
  }


  fetchAllFeeStructure() : Observable<any> {
    let urlFeeStruc = this.baseUrl + "/api/v1/student_wise/feeStructure/fetchAll/" + this.institute_id +'?isGeneral=true';

    return this.http.get(urlFeeStruc, { headers: this.headers }).map(
      res => {
        return res.json();
      },
      err => {
        return err.json();
      });
  }


  getFeeStructureById(id, obj) : Observable<any> {

    let urlFeebyId = this.baseUrl + "/api/v1/student_wise/feeStructure/fetch/" + this.institute_id + "/" + id;

    return this.http.post(urlFeebyId, obj, { headers: this.headers }).map(
      res => {
        return res.json();
      },
      err => {
        return err.json();
      });
  }


  fetchStudentFeeDetailById(id): Observable<any> {

    let urlFeeById = this.baseUrl + "/api/v1/studentWise/fee/schedule/fetch/" + this.institute_id + "/" + id;

    return this.http.get(urlFeeById, { headers: this.headers }).map(
      res => {
        this.studentFees = res.json();
        return res.json();
      },
      err => {
        return err.json();
      })

  }

  getStoredFees(){
    return this.studentFees;
  }

  getFeeDetailsById(i) : Observable<any> {

    let urlFeebyId = this.baseUrl + "/api/v1/batchFeeSched/feeType/" + i + "/details"

    return this.http.get(urlFeebyId, { headers: this.headers }).map(
      res => {
        return res.json();
      },
      err => {
        return err.json();
      });
  }

  fetchStudentBatchDetails(id): Observable<any> {
    let urlBatchById = this.baseUrl + "/api/v1/studentBatchMap/" +id;
    return this.http.get(urlBatchById, { headers: this.headers }).map(
      res => {
        if (res != null) {
          return res.json();
        }
      },
      err => {
        return err.json();
      }
    )
  }

  fetchStudentCourseDetails(id, stndrid): Observable<any> {
    stndrid = stndrid == 0? -1: stndrid;
    let urlCourseById = this.baseUrl + "/api/v1/courseMaster/fetchAssignedCoursesForStudent/" + id + "?standard_id=" +stndrid;
    return this.http.get(urlCourseById, { headers: this.headers }).map(
      res => {
        if (res != null) {
          return res.json();
        }
      },
      err => {
        return err.json();
      }
    )
  }

  fetchCourseMasterById(stndrid){
    stndrid = stndrid == 0? -1: stndrid;
    let urlCourseMaster = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/complete?standard_id=" +stndrid;
    return this.http.get(urlCourseMaster, { headers: this.headers }).map(
      res => { 
        return res.json(); 
      },
      err => {
        return err.json();
      })
  }

  getChequeStatus(): Observable<any>{
    let urlChequeStatus = this.baseUrl +"/api/v1/masterData/type/CHEQUE_STATUS"

    return this.http.get(urlChequeStatus, {headers: this.headers}).map(
      res => { return res.json(); },
      err => { return err.json(); }
    )
  }


  getPdcList(id, obj): Observable<any>{
    //console.log(obj);
    obj.cheque_date_from = obj.cheque_date_from == "Invalid date" ? '' : obj.cheque_date_from;
    obj.cheque_date_to = obj.cheque_date_to == "Invalid date" ? '' : obj.cheque_date_to;     
    let urlPdcList = this.baseUrl +"/api/v1/student_cheque/getAll/" +this.institute_id +"/" +id;

    return this.http.post(urlPdcList, obj, {headers: this.headers}).map(
      res => { return res.json(); },
      err => { return err.json(); }
    )

  }

}
