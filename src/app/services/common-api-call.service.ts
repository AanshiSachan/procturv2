import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CommonApiCallService {

  constructor(private http: HttpService) { }
  fetchInstituteExamTypes(instituteId:string): any {
    let url = "/api/v1/courseExamSchedule/fetch-exam-type/" + instituteId;
    this.http.getData(url).subscribe(
      (data : any) => {
        return data.result;
      },
      err => {
        return err;
      }
    )
  };

}
