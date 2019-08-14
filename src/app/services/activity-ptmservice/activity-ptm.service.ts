import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../authenticator.service";
import * as moment from 'moment';

@Injectable()
export class ActivityPtmService {
  baseUrl: string = '';
  Authorization: any;
  headers;
  institute_id;

  constructor(
    private http: HttpClient,
    private auth: AuthenticatorService
  )
   {
    this.auth.currentAuthKey.subscribe(key => {
      this.Authorization = key;
      this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    })
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.baseUrl = this.auth.getBaseUrl();
  }

  getAllMasterCourse() {
      let url = this.baseUrl + "/api/v1/courseMaster/fetch/" + this.institute_id + "/all";
      return this.http.get(url, { headers: this.headers }).map(
          res => {
              return res;
          },
          error => {
              return error;
          }
      );
  }

  getStandardSubjectList(stdId, subId, isAssigned) {
      let url = this.baseUrl + "/api/v1/batches/fetchCombinedBatchData/" + this.institute_id + "?standard_id=" + stdId + "&subject_id=" + subId + "&assigned=" + isAssigned;
      return this.http.get(url, { headers: this.headers }).map(
          res => { return res; },
          err => { return err; }
      )
  }

  getBatches(obj){
    let isActive = obj.is_active == 1 ? "Y" : "N";
    let url = this.baseUrl + "/api/v1/batches/all/" + this.institute_id + "?" + isActive;
    return this.http.get(url , {headers:this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

  loadPtm(obj){
    let url = this.baseUrl + "/api/v1/ptm/batch/" + obj.batch_id + "/schedules"
    return this.http.post(url , obj , {headers :this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

  viewStudents(ptm_id){
    let url = this.baseUrl + "/api/v1/ptm/" + ptm_id  + "/details"
    return this.http.get(url , {headers:this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

  sendNotification(ptm_id){
    let obj = {}
    let url = this.baseUrl + "/api/v1/ptm/ptmAlert/"+ptm_id+"/alerts";
    return this.http.post(url, obj,  {headers :this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

  cancelPTM(obj){
    let url = this.baseUrl + "/api/v1/ptm/cancel/"+obj.ptm_id;
    return this.http.put(url, obj,  {headers :this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

  scheduleNewPTM(obj){
    let url = this.baseUrl + "/api/v1/ptm/create/"+this.institute_id;
    return this.http.post(url, obj,  {headers :this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

  updatePTM(obj, ptmId){
    let url = this.baseUrl + "/api/v1/ptm/"+ptmId+"/details/record";
    return this.http.post(url, obj,  {headers :this.headers}).map(
      (data:any)=>{
        return data;
      },
      (error:any)=>{
        return error;
      }
    )
  }

}
