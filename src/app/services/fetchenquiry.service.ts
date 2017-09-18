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
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';

@Injectable()
export class FetchenquiryService {

  instituteData: instituteInfo = {
    institute_id: 100123, function_type: "manageSearchEnquiries", username: "31469|0",
    password: "admin@123", onLoad: 0, name: "", phone: "",
    email: "", enquiry_no: "", priority: "", filtered_statuses: "", follow_type: "",
    followUpDate: moment().format('YYYY-MM-DD'), enquiry_date: "", assigned_to: -1, standard_id: -1, subject_id: -1, is_recent: "Y",
    filtered_slots: "", isDashbord: "", enquireDateFrom: "", enquireDateTo: "",
    updateDate: "", updateDateFrom: "", updateDateTo: "",
    pageNo: 1, sizeLimit: 100,
  }

  url: string; urlCampaign: string; urlAssignTo: string; urlScholarSub: string;
  urlEnqsta: string; urlFollType: string; urlEnqPri: string; urlStdSub: string; urlSubject: string;
  Authorization: string; headers: Headers; headersCampaign: Headers; headersAssignTo: Headers;
  headersScholarSub: Headers; headersEnqsta: Headers; headersFollType: Headers; headersEnqPri: Headers;
  headersStdSub: Headers; headersSubject: Headers; instituteFormData: any = {}; row: any = []; filtered = [];
  daterange = {
    updateDateFrom: moment().startOf('month').format('YYYY-MM-DD'),
    updateDateTo: moment().format('YYYY-MM-DD'),
  };

  constructor(private http: Http) {
    this.Authorization = "MzE0Njl8MDphZG1pbkAxMjM6MTAwMTIz";
    this.instituteFormData = `institute_id=${this.instituteData.institute_id}&function_type=${this.instituteData.function_type}&username=${this.instituteData.username}&password=${this.instituteData.password}&onLoad=${this.instituteData.onLoad}&name=${this.instituteData.name}&phone=${this.instituteData.phone}&email=${this.instituteData.email}&enquiry=${this.instituteData.enquiry_no}&priority=${this.instituteData.priority}&filtered_statuses=${this.instituteData.filtered_statuses}&follow_type=${this.instituteData.follow_type}&followUpDate=${this.instituteData.followUpDate}&enquiry_date=${this.instituteData.enquiry_date}&assigned_to=${this.instituteData.assigned_to}&standard_id=${this.instituteData.standard_id}&subject_id=${this.instituteData.subject_id}&is_recent=${this.instituteData.is_recent}&filtered_slots=${this.instituteData.filtered_slots}&isDashbord=${this.instituteData.isDashbord}&enquireDateFrom=${this.instituteData.enquireDateFrom}&enquireDateTo=${this.instituteData.enquireDateTo}&updateDate=${this.instituteData.updateDate}&updateDateFrom=${this.instituteData.updateDateFrom}&updateDateTo=${this.instituteData.updateDateTo}&page=${this.instituteData.pageNo}&size=${this.instituteData.sizeLimit}`;

    this.url = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/dashboard/100123";
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);

    this.urlCampaign = 'https://app.proctur.com/CampaignServlet';
    this.headersCampaign = new Headers();
    this.headersCampaign.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

    this.urlAssignTo = "https://app.proctur.com/StdMgmtWebAPI/api/v1/profiles/100123";
    this.headersAssignTo = new Headers();
    this.headersAssignTo.append("Authorization", this.Authorization);
    this.headersAssignTo.append("Content-Type", "application/json");

    this.urlScholarSub = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/fetchCustomEnquiryComponents/100123?id=0&isSearhable=Y&page=1";
    this.headersScholarSub = new Headers();
    this.headersScholarSub.append("Authorization", this.Authorization);
    this.headersScholarSub.append("Content-Type", "application/json");

    this.urlEnqsta = "https://app.proctur.com/StdMgmtWebAPI/api/v1/masterData/type/SPEC_ENQUIRY_STATUS";
    this.headersEnqsta = new Headers();
    this.headersEnqsta.append("Authorization", this.Authorization);
    this.headersEnqsta.append("Content-Type", "application/json");

    this.urlEnqPri = "https://app.proctur.com/StdMgmtWebAPI/api/v1/masterData/type/ENQ_PRIORITY";
    this.headersEnqPri = new Headers();
    this.headersEnqPri.append("Authorization", this.Authorization);
    this.headersEnqPri.append("Content-Type", "application/json");

    this.urlFollType = "https://app.proctur.com/StdMgmtWebAPI/api/v1/masterData/type/ENQ_FOLLOW_TYPE";
    this.headersFollType = new Headers();
    this.headersFollType.append("Authorization", this.Authorization);
    this.headersFollType.append("Content-Type", "application/json");

    this.urlStdSub = "https://app.proctur.com/StdMgmtWebAPI/api/v1/standards/all/100123?active=Y";
    this.headersStdSub = new Headers();
    this.headersStdSub.append("Authorization", this.Authorization);
    this.headersStdSub.append("Content-Type", "application/json");
  }

  loadenquiry(daterange): Observable<any> {
    this.daterange = daterange;
    return this.http.post(this.url, this.daterange, { headers: this.headers })
      .map(result => result.json());
  }

  getAllEnquiry(): Observable<EnquiryCampaign[]> {
    return this.http.post(this.urlCampaign, this.instituteFormData, { headers: this.headersCampaign })
      .map(res => {
        this.row = res.json().aaData;
        return this.row;
      });
  }

  getAssignTo(): any {
    let content = JSON.stringify({ "user_Type": 0 });
    return this.http.post(this.urlAssignTo, content, { headers: this.headersAssignTo })
      .map(res => {
        return res.json()
      });
  }

  getScholarPrefillData(): any {
    return this.http.get(this.urlScholarSub, { headers: this.headersScholarSub })
      .map(res => {
        return res.json();
      })
  }

  getEnqStatus(): any{
    return this.http.get(this.urlEnqsta, { headers: this.headersEnqsta })
      .map(res => {
        return res.json();
      })
  }

  getEnqPriority(): any {
    return this.http.get(this.urlEnqPri, { headers: this.headersEnqPri })
      .map(res => {
        return res.json();
      })
  }

  getFollowupType(): any {
    return this.http.get(this.urlFollType, { headers: this.headersFollType })
      .map(res => {
        return res.json();
      })
  }

  getEnqStardards(): any{
    return this.http.get(this.urlStdSub, { headers: this.headersStdSub })
    .map(res => {
      return res.json();
    })
  }

  getEnqSubjects(id): any{
    this.urlSubject= "https://app.proctur.com/StdMgmtWebAPI/api/v1/subjects/standards/" +id;
    this.headersSubject = new Headers();
    this.headersSubject.append("Authorization", this.Authorization);
    this.headersSubject.append("Content-Type", "application/json");
    this.http.get(this.urlSubject, {headers: this.headersSubject})
  }

}