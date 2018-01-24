import { Component, OnInit } from '@angular/core';
import { CourseListService } from '../../../services/course-services/course-list.service';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-course-course-list',
  templateUrl: './course-course-list.component.html',
  styleUrls: ['./course-course-list.component.scss']
})
export class CourseCourseListComponent implements OnInit {

  showAddCourse: boolean = false;
  courseList: any;
  masterCourseList: any;
  newCourseAdd: any = {
    master_course_name: '',
    standard_id: '',
  }

  constructor(
    private apiService: CourseListService,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.getCourseListForTable();
    this.getMasterCourseList()
  }

  toggleCreateNewStandard() {
    if (this.showAddCourse == false) {
      this.showAddCourse = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.showAddCourse = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
  }


  getCourseListForTable() {
    this.apiService.getCourseListFromServer().subscribe(
      data => {
        console.log(data);
        this.courseList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  getMasterCourseList() {
    this.apiService.getMasterListFromServer().subscribe(
      data => {
        console.log(data);
        this.masterCourseList = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  btnGoClickCreateCourse() {
    if (this.newCourseAdd.master_course_name != "" && this.newCourseAdd.standard_id != "") {
      this.apiService.getSubjectListOfStandard(this.newCourseAdd.standard_id).subscribe(
        data => {
          console.log(data);
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
