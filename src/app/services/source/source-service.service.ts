import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";


@Injectable()
export class SourceServiceService {

  baseUrl: string = '';
  Authorization: any;
  headers;
  institute_id;
  constructor(private http: HttpClient,
    private auth: AuthenticatorService,) { 
      this.auth.currentAuthKey.subscribe(key => {
        this.Authorization = key;
        this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
      });
      this.auth.currentInstituteId.subscribe(id => {
        this.institute_id = id;
      });
      // this.institute_id = this.auth.getInstituteId();
      // this.Authorization = this.auth.getAuthToken();
      this.baseUrl = this.auth.getBaseUrl();
    }

    sourceInformation(){
      let url= this.baseUrl + "/api/v1/enquiry_campaign/master/lead_source/" + this.institute_id + "all";

      return this.http.get(url , {headers : this.headers }).map(
        (data:any)=>{
          return data;
        },
        (error:any)=>{
          return error;
        }
      )


    }

}
