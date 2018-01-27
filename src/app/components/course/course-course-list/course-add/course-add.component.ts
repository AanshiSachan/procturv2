import { Component, OnInit } from '@angular/core';
import { CourseListService } from '../../../../services/course-services/course-list.service';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.scss']
})
export class CourseAddComponent implements OnInit {

  newCourseAdd: any = {
    master_course_name: '',
    standard_id: '',
  }
  standardNameList;
  activeTeachers;

  constructor(
    private apiService: CourseListService,
    private toastCtrl: AppComponent,
  ) { }

  ngOnInit() {
    this.getAllStandardNameList();
  }

  btnGoClickCreateCourse() {
    if (this.newCourseAdd.master_course_name != "" && this.newCourseAdd.standard_id != "" && this.newCourseAdd.standard_id != -1) {
      this.apiService.getSubjectListOfStandard(this.newCourseAdd.standard_id).subscribe(
        (data: any) => {
          console.log(data);
          if (data.length == 0) {
            let msg = {
              type: "error",
              title: "",
              body: 'No Subjects configured for selected standard'
            }
            this.toastCtrl.popToast(msg);
          } else {
            this.getActiveTeacherList();
          }
        },
        error => {
          console.log(error);
          let data = {
            type: "error",
            title: "",
            body: error.error.message
          }
          this.toastCtrl.popToast(data);
        }
      )
    } else {
      let data = {
        type: "error",
        title: "",
        body: "Please Fill Mandatory Fields"
      }
      this.toastCtrl.popToast(data);
    }
  }

  getAllStandardNameList() {
    this.apiService.getStandardListFromServer().subscribe(
      data => {
        console.log(data);
        this.standardNameList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  getActiveTeacherList() {
    this.apiService.getTeacherListFromServer().subscribe(
      data => {
        console.log(data);
        this.activeTeachers = data;
      },
      error => {
        console.log(error);
        let data = {
          type: "error",
          title: "",
          body: "Please refresh the page."
        }
        this.toastCtrl.popToast(data);
      }
    )
  }


  /* Customiized click detection strategy */
  inputClickedCheck(ev) {
    if (ev.target.classList.contains('form-ctrl')) {
      if (ev.target.classList.contains('bsDatepicker')) {
        var nodelist = document.querySelectorAll('.bsDatepicker');
        [].forEach.call(nodelist, (elm) => {
          elm.addEventListener('focusout', function (event) {
            event.target.parentNode.classList.add('has-value');
          });
        });
      }
      else if ((ev.target.classList.contains('form-ctrl')) && !(ev.target.classList.contains('bsDatepicker'))) {
        //document.getElementById(ev.target.id).click();
        ev.target.addEventListener('blur', function (event) {
          if (event.target.value != '') {
            event.target.parentNode.classList.add('has-value');
          } else {
            event.target.parentNode.classList.remove('has-value');
          }
        });
      }
    }
  }

}
