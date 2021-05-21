import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import * as moment from 'moment';
import { AuthenticatorService } from '../../../../../services/authenticator.service';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.scss']
})
export class CourseAddComponent implements OnInit {
  academicList: any = [];
  subjectList: any = [];
  activeTeachers: any = [];
  courseDetails: any = {
    course_name: '',
    start_Date: '',
    end_Date: '',
    academic_year_id: '',
    master_course_id: '',
    inst_id: sessionStorage.getItem('institute_id')
  };

  constructor(
    private _httpService: HttpService,
    private _auth: AuthenticatorService
  ) { }

  ngOnInit(): void {
    this.courseDetails = JSON.parse(sessionStorage.getItem('cretaCourse'));
    let sub_list = JSON.parse(sessionStorage.getItem('subjectList'));
    this.subjectList = sub_list.subject_list;
    this.getActiveTeacherList(this.courseDetails.standard_id);
    console.log(this.subjectList);
    // sessionStorage.removeItem('cretaCourse');
    this.getAcademicYearDetails();
  }

  getAcademicYearDetails() {
    this.academicList = [];
    this._httpService.getData('/api/v1/academicYear/all/' + sessionStorage.getItem('institute_id')).subscribe(
      res => {
        this.academicList = res;
      },
      err => {
      }
    )
  }

  getActiveTeacherList(standard_id) {
    this._auth.showLoader();
    this._httpService.getData('/api/v1/teachers/fetch-teacher/' + sessionStorage.getItem('institute_id') + "?standard_id=" + standard_id + "&subject_id=&is_active=Y&is_std_sub_required=true").subscribe(
      (res: any) => {
        this._auth.hideLoader();
        this.activeTeachers = res.result;
        for (let i = 0; i < this.subjectList.length; i++) {
          this.subjectList[i].allowedTeacher = [];
          let is_teacher_exit: boolean = true;
          this.activeTeachers.filter(teacher => {
            if (teacher.standard_subject_list && teacher.standard_subject_list.length) {
              is_teacher_exit = false;
              this.subjectList[i].allowedTeacher.push(teacher);
              let is_more_option_exit: boolean = true;
              for (let data of this.subjectList[i].allowedTeacher) {
                if (data.teacher_id == 'more') {
                  is_more_option_exit = false
                  break;
                }
              }
              if (is_more_option_exit) {
                this.subjectList[i].allowedTeacher.push({
                  "is_active": "Y",
                  "standard_subject_list": [],
                  "teacher_email": null,
                  "teacher_id": "more",
                  "teacher_name": "Click Here to view more faculties",
                  "teacher_phone": "7503959545"
                })
              }
            }
          })
          if (is_teacher_exit) {
            this.subjectList[i].allowedTeacher.push({
              "is_active": "Y",
              "standard_subject_list": [],
              "teacher_email": null,
              "teacher_id": "more",
              "teacher_name": "Click Here to view more faculties",
              "teacher_phone": "7503959545"
            })
          }
        }
      },
      err => {
        this._auth.hideLoader();
        console.log(err);
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

  checkMoreOption(obj) {
    obj.selected_teacher == 'more' ? (obj.allowedTeacher = this.activeTeachers) : '';
  }


}
