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
  public instAcademicYrList=new BehaviorSubject(null);

  constructor(private http: HttpService) {
    this.fetchSchoolExamTypeList();
    this.fetchMasterData();
    this.getAllFinancialYear();
  }
  fetchSchoolExamTypeList(){
    if (sessionStorage.getItem("is_institute_type_school") == 'true') {
      this.http.getData("/api/v1/courseExamSchedule/fetch-exam-type/" + sessionStorage.getItem("institute_id"))
        .subscribe((data: any) => {
          this.examTypeList.next(data.result);
        });
    }
  }
  fetchInstituteExamTypes(instituteId: string): Observable<any> {
    let url = "/api/v1/courseExamSchedule/fetch-exam-type/" + instituteId;
    return this.http.getData(url);
  }
  fetchMasterData() {
    if (sessionStorage.getItem("is_institute_type_school") == 'true') {
      let obj=[
        "MOTHER_TOUNGE",
        "PROFESSION",
        "CASTE_CATEGORY",
        "BLOOD_GROUP"
      ];
    let url = "/api/v1/masterData/all";
    return this.http.postData(url,obj).subscribe(data => {
      this.masterDataList.next(data)
    });
  }
  }
  getAllFinancialYear() {
    let url = "/api/v1/academicYear/all/" + sessionStorage.getItem("institute_id");
    return this.http.getData(url).subscribe(data=>{
      this.instAcademicYrList.next(data);
    })
  }

}
