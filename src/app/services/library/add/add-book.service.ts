import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../../authenticator.service";
import { forkJoin } from "rxjs/observable/forkJoin";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AddBookService {

  baseUrl: string = '';
  Authorization: string;
  headers: any;
  headersPost: any;
  institute_id: any;
  userid: any;

  constructor(
    private http: HttpClient,
    private auth: AuthenticatorService
  ) {
    this.userid = sessionStorage.getItem('userid');
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.auth.currentAuthKey.subscribe(key => {
      this.Authorization = key;
      this.headers = new HttpHeaders(
        // {
        //   "Content-Type": "application/json",
        //   // "x-proc-inst-id": this.institute_id,
        //   // "x-proc-user-id": this.userid,
        //   "Authorization": this.Authorization
        // }
      );
       this.headers = this.headers.append('Content-Type', 'application/json');
       this.headers = this.headers.append('Authorization', this.Authorization);
       this.headers = this.headers.append("Accept", "*");
       this.headers = this.headers.append("x-proc-inst-id", this.institute_id.toString());
       this.headers = this.headers.append("x-proc-user-id", this.userid.toString());
    })

    this.baseUrl = this.auth.getBaseUrl();
  }


  getAllMasterData(){
    let url = this.baseUrl + "/library/masters/fetchAll";
    return this.http.get(url, { headers: this.headers }).map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    )
  }

  getSubCategories(category_id){
    let url = this.baseUrl + "/library/category/fetchSubCategories/" +category_id;
    return this.http.get(url, { headers: this.headers }).map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    )
  }

  addNewBook(obj){
    let url = this.baseUrl + "/library/book/create";
    return this.http.post(url, obj, { headers: this.headers }).map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    )
  }


}
