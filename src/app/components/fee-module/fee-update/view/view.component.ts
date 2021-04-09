import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService } from '../../../../services/http.service';
import { CommonServiceFactory } from '../../../../services/common-service';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  academicYrList: any = [];
  institute_id: string;
  student_id: number
  schoolModel: boolean = false;
  isProfessional: boolean;
  academic_yr_id: number = -1;
  stdFeeDataList: any = [];
  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private auth: AuthenticatorService,
    private commonService: CommonServiceFactory
  ) {
    this.student_id = +this.route.snapshot.paramMap.get('std_id');
    this.institute_id = sessionStorage.getItem("institute_id");
    // alert("View Fee= " + this.student_id);
    this.fetchAcademicYearList();

  }

  ngOnInit(): void {
    this.schoolModel = this.auth.schoolModel.value;
    this.institute_id = sessionStorage.getItem("institute_id");
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
  }
  fetchAcademicYearList() {
    this.auth.showLoader();
    let url = "/api/v1/academicYear/all/" + this.institute_id;
    this.http.getData(url).subscribe(
      (res: any) => {
        this.academicYrList = res;
        this.fetchDefaultAY();
        this.fetchStdFeeData(this.academic_yr_id);
        this.auth.hideLoader();
      },
      (error: any) => {
        this.auth.hideLoader();
        this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');

      }
    )
  }
  fetchDefaultAY() {
    if (this.academicYrList != null) {
      for (let data of this.academicYrList) {
        if (data.default_academic_year == 1) {
          this.academic_yr_id = data.inst_acad_year_id;
          break;
        }
      }
    }
  }
  fetchStdFeeData(academic_yr) {
    this.academic_yr_id=academic_yr;
    this.auth.showLoader();
    let url = "/api/v1/studentWise/fee/" + this.institute_id + "/students/" + this.student_id + "/" + academic_yr;
    this.http.getData(url).subscribe(
      (res: any) => {
        this.stdFeeDataList = res.result;
        this.auth.hideLoader();
      },
      (error: any) => {
        this.auth.hideLoader();
        this.stdFeeDataList = [];
        this.commonService.showErrorMessage('error', '', 'Something went wrong. Please try after sometime!');

      }
    )

  }
}
