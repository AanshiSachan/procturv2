import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Session } from "inspector";

@Injectable({
  providedIn: "root",
})
export class CommonApiCallService {
  public examTypeList = new BehaviorSubject(null);
  constructor(private http: HttpService) {
    if(sessionStorage.getItem("is_institute_type_school")=='true'){
    this.http
      .getData("/api/v1/courseExamSchedule/fetch-exam-type/"+sessionStorage.getItem("institute_id"))
      .subscribe((data: any) => {
        this.examTypeList.next(data.result);
      });
    }
  }
  fetchInstituteExamTypes(instituteId: string): Observable<any> {
    let url = "/api/v1/courseExamSchedule/fetch-exam-type/" + instituteId;
    return this.http.getData(url);
  }
  
}
