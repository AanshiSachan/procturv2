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
export class FetchenquiryService {

  instituteData: instituteInfo;
  url: string; 
  urlCampaign: string;
  Authorization: string; 
  headers: Headers; 
  headersCampaign: Headers; 

  instituteFormData: any = {}; 
  row: any = []; 
  filtered = [];
  daterange = {
    updateDateFrom: moment().startOf('month').format('YYYY-MM-DD'),
    updateDateTo: moment().format('YYYY-MM-DD'),
  };

  constructor(private http: Http) {

    this.Authorization = "MzE0Njl8MDphZG1pbkAxMjM6MTAwMTIz";

    this.url = "https://app.proctur.com/StdMgmtWebAPI/api/v1/enquiry/dashboard/100123";
    this.urlCampaign = 'https://app.proctur.com/CampaignServlet';

    this.headersCampaign = new Headers();
    this.headers = new Headers();
    this.headersCampaign.append("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    this.headers.append("Content-Type", "application/json");
    this.headers.append("Authorization", this.Authorization);
  }

  loadenquiry(daterange): Observable<any> {
    this.daterange = daterange;
    return this.http.post(this.url, this.daterange, { headers: this.headers })
      .map(result => result.json());
  }

  getAllEnquiry(instituteData: instituteInfo): Observable<EnquiryCampaign[]> {

    this.instituteFormData = `institute_id=${instituteData.institute_id}&function_type=${instituteData.function_type}&username=${instituteData.username}&password=${instituteData.password}&onLoad=${instituteData.onLoad}&name=${instituteData.name}&phone=${instituteData.phone}&email=${instituteData.email}&enquiry=${instituteData.enquiry_no}&priority=${instituteData.priority}&filtered_statuses=${instituteData.filtered_statuses}&follow_type=${instituteData.follow_type}&followUpDate=${instituteData.followUpDate}&enquiry_date=${instituteData.enquiry_date}&assigned_to=${instituteData.assigned_to}&standard_id=${instituteData.standard_id}&subject_id=${instituteData.subject_id}&is_recent=${instituteData.is_recent}&filtered_slots=${instituteData.filtered_slots}&isDashbord=${instituteData.isDashbord}&enquireDateFrom=${instituteData.enquireDateFrom}&enquireDateTo=${instituteData.enquireDateTo}&updateDate=${instituteData.updateDate}&updateDateFrom=${instituteData.updateDateFrom}&updateDateTo=${instituteData.updateDateTo}&page=${instituteData.pageNo}&size=${instituteData.sizeLimit}`;
    
    return this.http.post(this.urlCampaign, this.instituteFormData, { headers: this.headersCampaign })
      .map(res => {
        this.row = res.json().aaData;
        return this.row;
      });
  }

}