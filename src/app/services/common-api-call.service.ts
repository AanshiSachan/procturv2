import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CommonApiCallService {
  public examTypeList = new BehaviorSubject(null);
  public masterDataList = new BehaviorSubject(null);
  public instAcademicYrList = new BehaviorSubject(null);

  constructor(private http: HttpService) {
    this.fetchSchoolExamTypeList();
  }
  fetchSchoolExamTypeList() {
    if (sessionStorage.getItem("is_institute_type_school") == 'true') {
      this.http.getData("/api/v1/courseExamSchedule/fetch-exam-type/" + sessionStorage.getItem("institute_id"))
        .subscribe((data: any) => {
          this.examTypeList.next(data.result);
        });
    }
  }
  fetchInstituteExamTypes(instituteId: string): Observable<any> {
    let url = "/api/v1/courseExamSchedule/fetch-exam-type/" + instituteId+"?is_used_data=true";
    return this.http.getData(url);
  }
  fetchMasterData(): BehaviorSubject<any> {
      if (this.masterDataList.value == null) {
        let obj = [
          "MOTHER_TOUNGE",
          "PROFESSION",
          "CASTE_CATEGORY",
          "BLOOD_GROUP"
        ];
        let url = "/api/v1/masterData/all";
        this.http.postData(url, obj).subscribe(data => {
          this.masterDataList.next(data)
        });
        return this.masterDataList;
      }
      else {
        return this.masterDataList;
      }
  }
  getAllFinancialYear(): BehaviorSubject<any> {
    if (sessionStorage.getItem("is_institute_type_school") == 'true') {
      if (this.instAcademicYrList.value == null) {
        let url = "/api/v1/academicYear/all/" + sessionStorage.getItem("institute_id");
        this.http.getData(url).subscribe(data => {
          this.instAcademicYrList.next(data);
        })
        return this.instAcademicYrList;
      } else {
        return this.instAcademicYrList;
      }
    }
  }

}
