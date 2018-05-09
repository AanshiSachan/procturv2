import { Component, OnInit } from '@angular/core';
import { ExamGradeServiceService } from '../../../services/examgradeservice/exam-grade-service.service';
import { AppComponent } from '../../../app.component';
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
    institution_id: sessionStorage.getItem('institute_id')
  }
  editData:any = {
    description:"",
    grade:"",
    grade_id:"",
    institution_id:sessionStorage.getItem('institute_id')
  }
  gotGrades: any[] = [];
  addArray: any[] = [];
  constructor(private gradeService: ExamGradeServiceService, private appC: AppComponent) { }

  ngOnInit() {
    this.fetchGrades();
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
        console.log(data);
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
      this.gradeService.addData(this.addData).subscribe(
        (data: any) => {
          let msg = {
            type: "success",
            body: "Grade added successfully"
          }
          this.appC.popToast(msg);
          this.addData={
            institution_id:sessionStorage.getItem('institute_id'),
            description:"",
            grade:""
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

  // put data for edited request
  saveData(obj){
    
  }
}
