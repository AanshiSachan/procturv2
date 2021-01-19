import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../../app.component';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { ExamGradeServiceService } from '../../../../services/examgradeservice/exam-grade-service.service';
import { HttpService } from '../../../../services/http.service';
import { CommonApiCallService } from '../../../../services/common-api-call.service';
@Component({
  selector: 'app-manage-exam-grades',
  templateUrl: './manage-exam-grades.component.html',
  styleUrls: ['./manage-exam-grades.component.scss']
})
export class ManageExamGradesComponent implements OnInit {

  showToggle: boolean = false;
  addData: any = {
    grade: "",
    description: "",
    institution_id: sessionStorage.getItem('institute_id'),
    exam_type_id: -1,
    grade_points: "",
    marks_from: "",
    marks_to: ""
  }
  editData: any = {
    grade: "",
    description: "",
    institution_id: sessionStorage.getItem('institute_id'),
    exam_type_id: -1,
    grade_points: "",
    marks_from: "",
    marks_to: ""
  }
  deleteData: any = {
    grade_id: ""
  }
  gotGrades: any[] = [];
  addArray: any[] = [];
  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1, 2];
  dataStatus: boolean = false;
  type: string = '';
  examTypeList: any = [];
  selectedExamTypeId: number = -1;
  isSchoolModel: boolean = false;

  constructor(
    private gradeService: ExamGradeServiceService,
    private appC: AppComponent,
    private auth: AuthenticatorService, private http: HttpService, private commonApiCall:CommonApiCallService) {
    this.isSchoolModel = auth.schoolModel == 'true' ? true : false;

  }

  ngOnInit() {
    this.fetchGrades();
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.type = 'batch';
        }
        else {
          this.type = 'course';
        }
      })
    if (this.isSchoolModel) {
      this.fetchInstituteExamTypes();
    }
  }

  // toggle for add grade div
  toggleCreateNewgrade() {

    if (this.showToggle == false) {
      this.showToggle = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.showToggle = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }

  }
  // fetchGrades while api hits first time
  fetchGrades() {
    this.gradeService.fetchAllData().subscribe(
      (data: any) => {
        //console.log(data);
        this.gotGrades = data;
      },
      (error: any) => {
        return error;
      }
    )
  }
  // data added to table
  addDataToTable() {
    if (this.addData.description == "" || this.addData.grade == "" || this.addData.description == null || this.addData.grade == null) {
      let msg = {
        type: "error",
        title: "Incorrect Details",
        body: "All fields Are required"
      }
      this.appC.popToast(msg);
    }
    else if (this.addData.description != " " || this.addData.grade != " ") {
      let payload = {};
      if (this.isSchoolModel) {
        payload = {
          grade: this.addData.grade,
          description: this.addData.description,
          institution_id: sessionStorage.getItem('institute_id'),
          exam_type_id: this.selectedExamTypeId,
          grade_points: this.addData.grade_points,
          marks_from: this.addData.marks_from,
          marks_to: this.addData.marks_to
        }
      } else {
        payload = {
          grade: this.addData.grade,
          description: this.addData.description,
          institution_id: sessionStorage.getItem('institute_id'),

        }
      }
      this.gradeService.addData(payload).subscribe(
        (data: any) => {
          let msg = {
            type: "success",
            body: "Grade added successfully"
          }
          this.appC.popToast(msg);
          this.addData = {
            institution_id: sessionStorage.getItem('institute_id'),
            description: "",
            grade: ""
          }
          this.toggleCreateNewgrade();
          this.fetchGrades();
        },
        (error: any) => {
          let msg = {
            type: "error",
            body: error.error.message
          }
          this.appC.popToast(msg);
        }
      )
    }

  }
  // editing rows
  editRowTable(row, index) {
    document.getElementById(("row" + index).toString()).classList.remove('displayComp');
    document.getElementById(("row" + index).toString()).classList.add('editComp'); 4
    if (this.isSchoolModel) {
      this.fetchInstituteExamTypes();
      this.selectedExamTypeId = row.exam_type_id;
    }
  }
  // put data for edited request
  saveInformation(row, index) {
    let data = {};
    if (this.isSchoolModel) {
      data = {
        description: row.description,
        grade: row.grade,
        grade_id: row.grade_id,
        institution_id: sessionStorage.getItem('institute_id'),
        marks_from: row.marks_from,
        marks_to: row.marks_to,
        exam_type_id: this.selectedExamTypeId,
        grade_points: row.grade_points
      }
    } else {
      data = {
        description: row.description,
        grade: row.grade,
        grade_id: row.grade_id,
        institution_id: sessionStorage.getItem('institute_id'),
      }
    }
    this.gradeService.saveEdited(data).subscribe(
      (data: any) => {
        this.cancelEditRow(index);
        this.fetchGrades();
        let msg = {
          type: "success",
          body: "Grade updated successfully"
        }
        this.appC.popToast(msg);

      },
      error => {
        let acad = {
          type: "error",
          title: "Incorrect Details",
          body: error.error.message
        }
        this.appC.popToast(acad);
        this.fetchGrades();
      })

  }

  cancelEditRow(index) {
    document.getElementById(("row" + index).toString()).classList.add('displayComp');
    document.getElementById(("row" + index).toString()).classList.remove('editComp');
  }
  // delete particular grade
  deletingGrade(row, index) {

    let data = {
      grade_id: row.grade_id,
    }
    if (confirm('Are you sure, you want to delete?')) {
      this.gradeService.deleteRow(data).subscribe(
        (data: any) => {
          this.fetchGrades();
          let msg = {
            type: "success",
            body: "Grade deleted successfully"
          }
          this.appC.popToast(msg);

        },
        error => {
          let acad = {
            type: "error",
            title: "Incorrect Details",
            body: error.error.message
          }
          this.appC.popToast(acad);
          this.fetchGrades();
        })
    }
  }
  fetchInstituteExamTypes() {
    // let url = "/api/v1/courseExamSchedule/fetch-exam-type/" + sessionStorage.getItem('institute_id');
    // this.http.getData(url).subscribe((data: any) => {
    //   this.examTypeList = data.result;
    // }, err => {
      
    // })
    this.examTypeList=this.commonApiCall.fetchInstituteExamTypes(sessionStorage.getItem('institute_id'));
    console.log(this.examTypeList);
  };
  selectedExamType(exam_type_id) {
    this.selectedExamTypeId = exam_type_id;
  }
}
