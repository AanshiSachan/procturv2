import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "../../authenticator.service";
import { forkJoin } from "rxjs/observable/forkJoin";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MastersService {

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
        {
          // "Content-Type": "application/json",
          // "Accept": "*",
          // "Authorization": this.Authorization,
          // "x-proc-inst-id": this.institute_id.toString(),
          // "x-proc-user-id": this.userid.toString(),


        }
      );
      this.headers = this.headers.append('Content-Type', 'application/json');
      this.headers = this.headers.append('Authorization', this.Authorization);
      this.headers = this.headers.append("Accept", "*");
      this.headers = this.headers.append("x-proc-inst-id", this.institute_id.toString());
      this.headers = this.headers.append("x-proc-user-id", this.userid.toString());
    })

    this.baseUrl = this.auth.getBaseUrl();
   }


   searchData(section_name, search_string){
     let url = this.baseUrl + "/library/"+section_name+"/fetch?name="+search_string;
     return this.http.get(url, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }


   // --------------FOR Category & Sub - Category---------------

   addCategory(obj){
     let url = this.baseUrl + "/library/category/create";
     return this.http.post(url, obj, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }
   addCatAndSubCat(obj){
     let url = this.baseUrl + "/library/category/createBulk";
     return this.http.post(url, obj, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   getAllCategory(){
     let url = this.baseUrl + "/library/category/fetch";
     return this.http.get(url, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   getAllParentCategory(){
     let url = this.baseUrl + "/library/category/fetchParentCategories";
     return this.http.get(url, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   updateCatSubCat(obj){
     let url = this.baseUrl + "/library/category/updateBulk";
     return this.http.post(url, obj, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   updateCat(obj){
     let url = this.baseUrl + "/library/category/update";
     return this.http.post(url, obj, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   // --------------FOR Subject------------------

   getAllSubjects(){
     let url = this.baseUrl + "/library/subject/fetch";
     return this.http.get(url, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   addSubject(obj){

     let url = this.baseUrl + "/library/subject/create";
     return this.http.post(url, obj, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   updateSubject(obj){
     let url = this.baseUrl + "/library/subject/update";
     return this.http.post(url, obj, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   // ------------------- FOR Publication ---------------------------

   addPublication(obj){

     let url = this.baseUrl + "/library/publication/create";
     return this.http.post(url, obj, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   getAllPublications(){
     let url = this.baseUrl + "/library/publication/fetch";
     return this.http.get(url, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   updatePublication(obj){
     let url = this.baseUrl + "/library/publication/update";
     return this.http.post(url, obj, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }


   // ------------------- FOR Author ---------------------------


   addAuthor(obj){

     let url = this.baseUrl + "/library/author/create";
     return this.http.post(url, obj, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   getAllAuthors(){
     let url = this.baseUrl + "/library/author/fetch";
     return this.http.get(url, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   updateAuthor(obj){
     let url = this.baseUrl + "/library/author/update";
     return this.http.post(url, obj, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }


   // ------------------- FOR REFERENCES ---------------------------

   addReference(obj){

     let url = this.baseUrl + "/library/reference/create";
     return this.http.post(url, obj, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   getAllReferences(){
     let url = this.baseUrl + "/library/reference/fetch";
     return this.http.get(url, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   updateReference(obj){
     let url = this.baseUrl + "/library/reference/update";
     return this.http.post(url, obj, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }


   // ------------------- FOR Language ---------------------------

   addLanguage(obj){

     let url = this.baseUrl + "/library/language/create";
     return this.http.post(url, obj, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   getAllLanguages(){
     let url = this.baseUrl + "/library/language/fetch";
     return this.http.get(url, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }

   updateLanguage(obj){
     let url = this.baseUrl + "/library/language/update";
     return this.http.post(url, obj, { headers: this.headers }).map(
       response => {
         return response;
       },
       errorResponse => {
         return errorResponse;
       }
     )
   }



   // ------------------ COMMON ------------------------------


   delete(id, key_name){
     let url = this.baseUrl + "/library/" +key_name+ "/delete/" + id;
       return this.http.delete(url, { headers: this.headers }).map(
         res => {
           return res;
         },
         err => {
           return err;
         }
       )
   }

   // cancelLeaveOfDay(id) {
   //   let url = this.baseUrl + "/api/v1/studentleaves/cancel/" + id;
   //   return this.http.delete(url, { headers: this.headers }).map(
   //     res => {
   //       return res;
   //     },
   //     err => {
   //       return err;
   //     }
   //   )
   // }

   fetchDashboardMonitor(){
    let url = this.baseUrl + "/library/book/dashboard";
    return this.http.get(url, { headers: this.headers }).map(
      response => {
        return response;
      },
      errorResponse => {
        return errorResponse;
      }
    )
  }
}
