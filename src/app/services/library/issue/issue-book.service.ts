
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../../authenticator.service";
import { forkJoin ,  Observable } from "rxjs";

@Injectable()
export class IssueBookService {

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

   getSearchedBooks(searchInput){
     let url = this.baseUrl + "/library/book/fetch?name="+searchInput;
     return this.http.get(url, { headers: this.headers }).pipe(map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     ))
   }

   getInstituteSettingFromServer() {
    let url = this.baseUrl + "/api/v1/institute/settings/" + this.institute_id;
    return this.http.get(url, { headers: this.headers }).pipe(map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    ))
}

   getBorrowerData(searchInput){
     let matches = searchInput.match(/\d+/g);
     let searchBy = "name";
      if (matches != null) {
          searchBy = "phone"
      }

     let url = this.baseUrl + "/library/student/fetch?"+searchBy+"="+searchInput;
     return this.http.get(url, { headers: this.headers }).pipe(map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     ))
   }

   getBookFilterData(obj){
     let url = this.baseUrl + "/library/book/advanceSearch";
     return this.http.post(url, obj, { headers: this.headers }).pipe(map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     ))
   }

   getBookDetails(book_id){
     let url = this.baseUrl + "/library/book/fetchCompleteDetails/"+book_id;
     return this.http.get(url, { headers: this.headers }).pipe(map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     ))
   }

   issueBook(obj){
     let url = this.baseUrl + "/library/book/issue";
     return this.http.post(url, obj, { headers: this.headers }).pipe(map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     ))
   }

   getBooksStatusForStudent(student_id){
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



}
