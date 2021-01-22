import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class CommonApiCallService {

  constructor(private http: HttpService) { }
  fetchInstituteExamTypes(instituteId:string): Observable<any> {
    let url = "/api/v1/courseExamSchedule/fetch-exam-type/" + instituteId;
    return this.http.getData(url);
  };

}
