import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticatorService } from "./authenticator.service";
import { forkJoin } from "rxjs/observable/forkJoin";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ToDoListService {

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


   getAllToDoList() {
     let url = this.baseUrl + "/api/v2/toDoList/allToDoList/" + this.institute_id +"?sorted_by=''";
     return this.http.get(url, { headers: this.headers }).map(
       data => {
         return data;
       },
       err => {
         return err;
       }
     )
   }

   addToDoList(obj){
     obj.institute_id = this.institute_id;
     obj.userid = sessionStorage.getItem('userid');

     let url = this.baseUrl + "/api/v2/toDoList/create";
     return this.http.post(url, obj, { headers: this.headers }).map(
       data => {
         return data;
       },
       err => {
         return err;
       }
     )
   }

   updateSequence(obj){
     obj.institute_id = this.institute_id;
     obj.userid = sessionStorage.getItem('userid');

     let url = this.baseUrl + "/api/v2/toDoList/update";
     return this.http.put(url, obj, { headers: this.headers }).map(
       data => {
         return data;
       },
       err => {
         return err;
       }
     )
   }

   updateToDo(obj){
     obj.institute_id = this.institute_id;
     obj.userid = sessionStorage.getItem('userid');

     let url = this.baseUrl + "/api/v2/toDoList/update";
     return this.http.put(url, obj, { headers: this.headers }).map(
       data => {
         return data;
       },
       err => {
         return err;
       }
     )
   }

   deleteToDo(task_id){
     let url = this.baseUrl + "/api/v2/toDoList/delete/"+this.institute_id +"/"+task_id;
     return this.http.delete(url, { headers: this.headers }).map(
       data => {
         return data;
       },
       err => {
         return err;
       }
     )
   }

}
