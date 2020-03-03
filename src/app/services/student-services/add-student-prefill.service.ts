import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthenticatorService } from '../authenticator.service';

@Injectable()
export class AddStudentPrefillService {

  studentFees: any;
  Authorization: string;
  headers: any;
  institute_id: number;

  private urlinventory: string;
  private urlCustomComponent: string;
  private urlBatchData: string;
  private urlFeeStructure: string;
  private urlFeeSchedule: string;
  private urlFeeInstallment: string;
  private urlAdditionalFeeDetails: string;
  baseUrl: string = '';



  constructor(private http: HttpClient, private auth: AuthenticatorService) {
    this.auth.currentAuthKey.subscribe(key => {
      this.Authorization = key;
      this.headers = new HttpHeaders(
        { "Content-Type": "application/json", "Authorization": this.Authorization });
    })
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.baseUrl = this.auth.getBaseUrl();

  }



  /* return the list of inventory arcticles required by the student */
  fetchInventoryList(): Observable<any> {
    this.urlinventory = this.baseUrl + "/api/v1/inventory/item/fetchForStudentAllocationWhileCreation";
    let data = { standard_id: null, subject_id: null };
    return this.http.post(this.urlinventory, data, { headers: this.headers })
      .map(
        el => { return el; },
        err => { return err; }
      );
  }


  fetchInventoryListById(id): Observable<any> {
    let urlinventoryByid = this.baseUrl + "/api/v1/inventory/item/fetchForStudentAllocation/" + id;

    return this.http.get(urlinventoryByid, { headers: this.headers })
      .map(
        el => { return el; },
        err => { return err; }
      );
  }

  fetchInventoryListHistory(id): Observable<any> {

    let urlinventoryHistory = this.baseUrl + '/api/v1/inventory/item/student/txHistory/' + id;

    return this.http.get(urlinventoryHistory, { headers: this.headers }).map(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )

  }

  /* return the list of custom component for the selected institute ID */
  fetchCustomComponentById(id,en_id,page_id): Observable<any> {
    this.urlCustomComponent = this.baseUrl + "/api/v1/enquiry/fetchCustomEnquiryComponents/" + this.institute_id + "?id=" + id + "&isSearhable=undefined&student_enq_id="+en_id+"&page="+page_id//2";
    return this.http.get(this.urlCustomComponent, { headers: this.headers })
      .map(
        data => {
          return data;
        },
        err => {
          return err;
        }
      );
  }


  /* return the list of batch for students  */
  fetchBatchDetails(): Observable<any> {
    this.urlBatchData = this.baseUrl + "/api/v1/batches/all/" + this.institute_id + "?active=Y&isFeeTemplates=Y"
    return this.http.get(this.urlBatchData, { headers: this.headers })
      .map(
        data => { return data; },
        err => {
          return err;
        }
      );
  }


  /* return the list of Fee Structure */
  fetchFeeStructure(): Observable<any> {
    this.urlFeeStructure = this.baseUrl + "/api/v1/student_wise/feeStructure/fetchAll/" + this.institute_id;
    return this.http.get(this.urlFeeStructure, { headers: this.headers })
      .map(
        data => { return data; },
        err => {
          return err;
        })
  }



  /* return list of fee schedule for students */
  fetchFeeSchedule(): Observable<any> {

    this.urlFeeSchedule = this.baseUrl + "/api/v1/studentWise/fee/schedule/fetch/" + this.institute_id + "/-1";

    return this.http.get(this.urlFeeSchedule, { headers: this.headers })
      .map(
        data => { return data; },
        err => {
          return err;
        }
      )
  }



  /* return installment data for selected fee structure */
  fetchFeeInstallmentDetails(id, data): Observable<any> {
    this.urlFeeInstallment = this.baseUrl + "/api/v1/student_wise/feeStructure/fetch/" + this.institute_id + "/" + id;
    return this.http.post(this.urlFeeInstallment, data, { headers: this.headers })
      .map(
        data => { return data; },
        err => {
          return err;
        }
      )
  }


  /* return the details for additional fee selected for student  */
  fetchAdditionalFeesInfo(id): Observable<any> {
    this.urlAdditionalFeeDetails = this.baseUrl + "/api/v1/batchFeeSched/feeType/" + id + "/details";
    return this.http.get(this.urlAdditionalFeeDetails, { headers: this.headers })
      .map(
        data => { return data; },
        err => {
          return err;
        }
      )
  }


  fetchSlots(): Observable<any> {
    let urlFetchSlot = this.baseUrl + "/api/v1/inst_slot/all/" + this.institute_id;

    return this.http.get(urlFetchSlot, { headers: this.headers }).map(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )
  }


  fetchLangStudentStatus(): Observable<any> {
    let urlLangStatus = this.baseUrl + "/api/v1/masterData/type/LANG_STUDENT_STATUS";

    return this.http.get(urlLangStatus, { headers: this.headers }).map(
      res => { return res; },
      err => {
        return err;
      }
    )
  }


  fetchLangbatch(): Observable<any> {
    let urlLangBatch = this.baseUrl + "/api/v1/batches/all/" + this.institute_id + "?active=Y";

    return this.http.get(urlLangBatch, { headers: this.headers }).map(
      res => { return res; },
      err => {
        return err;
      }
    )
  }



  fetchCourseList(id): Observable<any> {

    let urlCourses = this.baseUrl + "/api/v1/subjects/standards/" + id;

    return this.http.get(urlCourses, { headers: this.headers }).map(
      res => { return res; },
      err => {
        return err;
      }
    )

  }


  fetchMasterCourse(): Observable<any> {
    let urlMaster = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/all";
    return this.http.get(urlMaster, { headers: this.headers }).map(
      res => { return res; },
      err => {
        return err;
      }
    )
  }


  fetchAllFeeStructure(): Observable<any> {
    let urlFeeStruc = this.baseUrl + "/api/v1/student_wise/feeStructure/fetchAll/" + this.institute_id + '?isGeneral=true';

    return this.http.get(urlFeeStruc, { headers: this.headers }).map(
      res => {
        return res;
      },
      err => {
        return err;
      });
  }


  getFeeStructureById(id, obj): Observable<any> {
    let urlFeebyId = this.baseUrl + "/api/v1/student_wise/feeStructure/fetch/" + this.institute_id + "/" + id;

    return this.http.post(urlFeebyId, obj, { headers: this.headers }).map(
      res => {
        this.studentFees = res;
        return res;
      },
      err => {
        return err;
      });
  }


  fetchStudentFeeDetailById(id): Observable<any> {

    let urlFeeById = this.baseUrl + "/api/v1/studentWise/fee/schedule/fetch/" + this.institute_id + "/" + id;

    return this.http.get(urlFeeById, { headers: this.headers }).map(
      res => {
        this.studentFees = res;
        return res;
      },
      err => {
        return err;
      })

  }

  getStoredFees() {
    return this.studentFees;
  }

  getFeeDetailsById(i): Observable<any> {

    let urlFeebyId = this.baseUrl + "/api/v1/batchFeeSched/feeType/" + i + "/details"

    return this.http.get(urlFeebyId, { headers: this.headers }).map(
      res => {
        return res;
      },
      err => {
        return err;
      });
  }

  fetchStudentBatchDetails(id): Observable<any> {
    let urlBatchById = this.baseUrl + "/api/v1/studentBatchMap/" + id + "?isFeeTemplates=Y";
    return this.http.get(urlBatchById, { headers: this.headers }).map(
      res => {
        if (res != null) {
          return res;
        }
      },
      err => {
        return err;
      }
    )
  }

  fetchStudentCourseDetails(id, stndrid,country_id='-1'): Observable<any> {
    stndrid = stndrid == 0 ? -1 : stndrid;
    let urlCourseById = this.baseUrl + "/api/v1/courseMaster/fetchAssignedCoursesForStudent/" + id + "?standard_id=" + stndrid+'&country_id='+country_id;
    return this.http.get(urlCourseById, { headers: this.headers }).map(
      res => {
        if (res != null) {
          return res;
        }
      },
      err => {
        return err;
      }
    )
  }

  fetchCourseMasterById(stndrid) {
    stndrid = stndrid == 0 ? -1 : stndrid;
    let urlCourseMaster = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/complete?standard_id=" + stndrid + "&isFeeTemplates=Y";
    return this.http.get(urlCourseMaster, { headers: this.headers }).map(
      res => {
        return res;
      },
      err => {
        return err;
      })
  }

  getChequeStatus(): Observable<any> {
    let urlChequeStatus = this.baseUrl + "/api/v1/masterData/type/CHEQUE_STATUS"
    return this.http.get(urlChequeStatus, { headers: this.headers }).map(
      res => { return res; },
      err => { return err; }
    )
  }


  getPdcList(id, obj): Observable<any> {
    obj.cheque_date_from = obj.cheque_date_from == "Invalid date" ? '' : obj.cheque_date_from;
    obj.cheque_date_to = obj.cheque_date_to == "Invalid date" ? '' : obj.cheque_date_to;
    let urlPdcList = this.baseUrl + "/api/v1/student_cheque/getAll/" + this.institute_id + "/" + id;
    return this.http.post(urlPdcList, obj, { headers: this.headers }).map(
      res => { return res; },
      err => { return err; }
    )
  }


  getFeeReceiptById(id) {
    let url = this.baseUrl + "/api/v1/studentWise/fee/" + 11791 + "/feeReceipt/" + id + "/download?fin_yr=17-18";
    return this.http.get(url, { headers: this.headers }).map(
      res => {
        return res;
      },
      err => {
        return err;
      }
    )
  }


}
