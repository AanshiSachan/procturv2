
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../../authenticator.service";
import { forkJoin ,  Observable } from "rxjs";

@Injectable()
export class ReturnBookService {

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

  getSearchedBooksOrStudents(searchInput){
    let url = this.baseUrl + "/library/book/fetchStudentAndBooks?name="+searchInput;
    return this.http.get(url, { headers: this.headers }).pipe(map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    ))
  }

  getIssuedBooksByBook(book_id){
    let url = this.baseUrl + "/library/book/fetchIssuedBooksByBookId/"+book_id;
    return this.http.get(url, { headers: this.headers }).pipe(map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    ))
  }

  getIssuedBooksByStudent(student_id){
    let url = this.baseUrl + "/library/book/fetchIssuedBooksToStudent/"+student_id;
    return this.http.get(url, { headers: this.headers }).pipe(map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    ))
  }

  returnBook(obj){
    let url = this.baseUrl + "/library/book/return";
    return this.http.post(url, obj, { headers: this.headers }).pipe(map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    ))
  }

  downloadReceipt(issueBookId){
    let url = this.baseUrl + "/library/book/download?issueBookId="+issueBookId;
    return this.http.get(url, { headers: this.headers }).pipe(map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    ))
  }

}

