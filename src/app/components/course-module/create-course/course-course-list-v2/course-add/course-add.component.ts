import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import * as moment from 'moment';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.scss']
})
export class CourseAddComponent implements OnInit {
  academicList:any=[];
  courseDetails: any = {
    course_name: '',
    start_Date: '',
    end_Date: '',
    academic_year_id: '',
    master_course_id: '',
    inst_id:sessionStorage.getItem('institute_id')
  };

  constructor(
    private _httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.getAcademicYearDetails();
  }

  getAcademicYearDetails() {
    this.academicList = [];
    this._httpService.getData('/api/v1/academicYear/all/').subscribe(
      res => {
        this.academicList = res;
      },
      err => {
      }
    )
  }

  setStartAdEndDate(row) {
    for (let acad of this.academicList) {
      if (row == null) {
        if (acad.default_academic_year == 1) {
          // this.defaultAY=acad.inst_acad_year_id;
          // this.defaultAYStartDate=moment(acad.start_date).format('YYYY-MM-DD');
          // this.defaultAYEndDate=moment(acad.end_date).format('YYYY-MM-DD');
          this.courseDetails.academic_year_id = acad.inst_acad_year_id;
          this.courseDetails.start_Date = moment(acad.start_date).format('YYYY-MM-DD');
          this.courseDetails.end_Date = moment(acad.end_date).format('YYYY-MM-DD');
          break;
        }
      }
      else if (acad.inst_acad_year_id == row.academic_year_id) {
        row.start_Date = moment(acad.start_date).format('YYYY-MM-DD');
        row.end_Date = moment(acad.end_date).format('YYYY-MM-DD');
        break;
      }
      else if (row.academic_year_id == '-1') {
        row.start_Date = ''
        row.end_Date = ''
        break;
      }
    }
  }


}
