import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { instituteInfo } from '../model/instituteinfo';
import {EnquiryCampaign} from '../model/enquirycampaign';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class FetchenquirycampaignService {

  instituteData: instituteInfo = {
    institute_id: 100123,function_type: "manageSearchEnquiries",username: "31469|0",
    password: "admin@123",onLoad: 0,name: "",phone: "",
    email: "",enquiry_no: "",priority: "",filtered_statuses: "",follow_type: "",
    followUpDate: "2017-08-16",enquiry_date: "",assigned_to: -1,standard_id: -1,subject_id: -1,is_recent: "Y",
    filtered_slots: "",isDashbord: "",enquireDateFrom: "",enquireDateTo: "",
    updateDate: "",updateDateFrom: "",updateDateTo: "",
  }

  url?: string;
  headers?: Headers;
  instituteFormData: any = {};
  determinate = 0;

  constructor(private http: Http) {
    
    this.url = "https://app.proctur.com/CampaignServlet";
    this.instituteFormData = `institute_id=${this.instituteData.institute_id}&function_type=${this.instituteData.function_type}&username=${this.instituteData.username}&password=${this.instituteData.password}&onLoad=${this.instituteData.onLoad}&name=${this.instituteData.name}&phone=${this.instituteData.phone}&email=${this.instituteData.email}&enquiry=${this.instituteData.enquiry_no}&priority=${this.instituteData.priority}&filtered_statuses=${this.instituteData.filtered_statuses}&follow_type=${this.instituteData.follow_type}&followUpDate=${this.instituteData.followUpDate}&enquiry_date=${this.instituteData.enquiry_date}&assigned_to=${this.instituteData.assigned_to}&standard_id=${this.instituteData.standard_id}&subject_id=${this.instituteData.subject_id}&is_recent=${this.instituteData.is_recent}&filtered_slots=${this.instituteData.filtered_slots}&isDashbord=${this.instituteData.isDashbord}&enquireDateFrom=${this.instituteData.enquireDateFrom}&enquireDateTo=${this.instituteData.enquireDateTo}&updateDate=${this.instituteData.updateDate}&updateDateFrom=${this.instituteData.updateDateFrom}&updateDateTo=${this.instituteData.updateDateTo}`;
    this.headers = new Headers();
    this.headers.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
/*     console.log(this.instituteFormData); */
  }

  getAllEnquiry(): Observable<EnquiryCampaign[]>{

    return this.http.post(this.url, this.instituteFormData, { headers: this.headers })
      .map(res => {
        return res.json().aaData
      })
  }
}

