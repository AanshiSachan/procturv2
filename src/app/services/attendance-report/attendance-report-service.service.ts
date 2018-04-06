import { Injectable ,} from '@angular/core';
import {HttpClient,  HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";
import {Observable} from 'rxjs/observable';
@Injectable()
export class AttendanceReportServiceService {
  baseUrl: string = '';
  Authorization: any;
  headers;
  institute_id;
  standard_id;
  subject_id;
  assigned;
  constructor(private http:HttpClient , private auth: AuthenticatorService) { 

    this.institute_id = this.auth.getInstituteId();
    this.Authorization = this.auth.getAuthToken();
    //console.log(this.institute_id);
    this.baseUrl = this.auth.getBaseUrl();
    this.headers = new HttpHeaders(
      { "Content-Type": "application/json", "Authorization": this.Authorization });

  }
  getMasterCourse(obj){
    let url=this.baseUrl + "/api/v1/batches/fetchCombinedBatchData/" +this.institute_id +"?standard_id="+obj.standard_id+"&subject_id="+obj.subject_id+"&assigned="+obj.assigned;
    return this.http.get(url , {headers:this.headers}).map(
      data =>{
        //console.log(data)
        return data;
      },
      error=>{
        return error;
      }
    )
  }

}
