
import {map} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticatorService } from "./authenticator.service";

@Injectable()
export class ExpensesService {

  baseUrl: string = '';
  Authorization: string;
  headers: any;
  headersPost: any;
  institute_id: number;

  constructor(
    private http: HttpClient,
    private auth: AuthenticatorService
  ) {
    this.auth.currentAuthKey.subscribe(key => {
      this.Authorization = key;
      this.headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": this.Authorization });
    })
    this.auth.currentInstituteId.subscribe(id => {
      this.institute_id = id;
    });
    this.baseUrl = this.auth.getBaseUrl();
   }

   getAllCategory(){
     let url = this.baseUrl + "/api/v1/expense/category/all/" + this.institute_id;
     return this.http.get(url, { headers: this.headers }).pipe(map(
       data => {
         return data;
       },
       err => {
         return err;
       }
     ))
   }

   addCategory(obj){
     obj.institute_id = this.institute_id;

     let url = this.baseUrl + "/api/v1/expense/category/add";
     return this.http.post(url, obj, { headers: this.headers }).pipe(map(
       data => {
         return data;
       },
       err => {
         return err;
       }
     ))
   }

   addExpense(obj){
     obj.institute_id = this.institute_id;

     let url = this.baseUrl + "/api/v1/expense/add";
     return this.http.post(url, obj, { headers: this.headers }).pipe(map(
       data => {
         return data;
       },
       err => {
         return err;
       }
     ))
   }

   getAllExpenses(obj){

     let url = this.baseUrl + "/api/v1/expense/" + this.institute_id + "/all";
     return this.http.post(url, obj, { headers: this.headers }).pipe(map(
       data => {
         return data;
       },
       err => {
         return err;
       }
     ))

   }

   updateExpense(obj, expense_id){
     obj.institute_id = this.institute_id;

     let url = this.baseUrl + "/api/v1/expense/update/" + expense_id;
     return this.http.put(url, obj, { headers: this.headers }).pipe(map(
       data => {
         return data;
       },
       err => {
         return err;
       }
     ))
   }

   //
   // getExpense(expense_id){
   //   let url = this.baseUrl + "/api/v1/expense/get/"+ expense_id +"/"+ this.institute_id;
   //   return this.http.get(url, { headers: this.headers }).map(
   //     data => {
   //       return data;
   //     },
   //     err => {
   //       return err;
   //     }
   //   )
   // }



}
