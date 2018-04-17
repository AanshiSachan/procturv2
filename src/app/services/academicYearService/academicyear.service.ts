import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";
import {Observable} from 'rxjs/observable';
import * as moment from 'moment';
 
@Injectable()
export class AcademicyearService {

  baseUrl: string = '';
  Authorization: any;
  headers;
  institute_id;

  constructor(
    private http: HttpClient,
    private auth: AuthenticatorService,
  ) {
    this.auth.currentAuthKey.subscribe( key => {
      this.Authorization = key;
      this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    });
    this.auth.currentInstituteId.subscribe( id => {
      this.institute_id = id;
    });
    // this.institute_id = this.auth.getInstituteId();
    // this.Authorization = this.auth.getAuthToken();
    this.baseUrl = this.auth.getBaseUrl();

  }


  getServices(){

    let url= this.baseUrl + "/api/v1/academicYear/all/" + this.institute_id; 
    return this.http.get(url, {headers: this.headers}).map(
      data => {

        return data;
    },
    error => {
        return error;
    }
    )
  }
  

  addNewAcademicYear(obj){
    obj.start_date = moment(obj.start_date).format("YYYY-MM-DD");
    obj.end_date = moment(obj.end_date).format("YYYY-MM-DD");
    let url= this.baseUrl + "/api/v1/academicYear";

    return this.http.post(url, obj, {headers:this.headers}).map(
      data =>{
        return data;
      },
      err => {
        return err;
        
    })

  }

  editAcademicYear(obj, id){
    
    let url=this.baseUrl + "/api/v1/academicYear/" +id;
    obj.start_date = moment(obj.start_date).format("YYYY-MM-DD");
    obj.end_date = moment(obj.end_date).format("YYYY-MM-DD");
    console.log(obj.start_date);
    return this.http.put(url, obj, {headers:this.headers}).map(
      data =>{
       
        return data;
      },
      err =>{
        return err;
      })
      
  }
}
