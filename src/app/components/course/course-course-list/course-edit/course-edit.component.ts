import { Component, OnInit } from '@angular/core';
import { CourseListService } from '../../../../services/course-services/course-list.service';
import { AppComponent } from '../../../../app.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit {

  courseName: any;
  activeTeachers: any;
  selectedCourseDetails: any = [];
  standardNameList: any;
  mainTableDataSource: any = [];
  nestedTableDataSource: any;
  subjectList: any;

  constructor(
    private apiService: CourseListService,
    private toastCtrl: AppComponent,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(
      params => {
        if (params.course_name != undefined && params.course_name != "" && params.course_name != null) {
          this.courseName = params.course_name;
        } else {
          this.router.navigateByUrl('course/courselist');
        }
      }
    )
  }

  ngOnInit() {
    this.getSelectedCourse(this.courseName);
    this.getAllStandardNameList();
    this.getActiveTeacherList();
  }

  getSelectedCourse(data) {
    this.apiService.getSeletedMasterCourseEdit(data).subscribe(
      (res: any) => {
        this.selectedCourseDetails = res;
        console.log(this.selectedCourseDetails);
        this.getSubjectList(res.standard_id);
        this.getMetaDataForTable(this.selectedCourseDetails);
      },
      error => {
        console.log(error);
        this.messageToast('error', 'Error', 'Please refresh the page.');
      }
    )
  }

  getAllStandardNameList() {
    this.apiService.getStandardListFromServer().subscribe(
      (data: any) => {
        console.log(data);
        this.standardNameList = data;
      },
      error => {
        console.log(error);
        this.messageToast('error', 'Error', 'Please refresh the page.');
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
        this.messageToast('error', 'Error', 'Please refresh the page.');
      }
    )
  }

  getSubjectList(standardID) {
    this.apiService.getSubjectListOfStandard(standardID).subscribe(
      res => {
        console.log('subject List', res);
        this.subjectList = this.addKeyInData(res);
        this.nestedTableDataSource = this.addKeyInData(res);
      },
      err => {
        console.log(err);
        this.messageToast('error', 'Error', 'Please refresh the page.');
      }
    )
  }

  updateEditedDetails() {
    let dataToSend: any = this.constructJsonToSend();
    // this.apiService.updateDetailsInEdit(dataToSend).subscribe(
    //   res => {
    //     console.log(res);
    //   },
    //   err => {
    //     console.log(err);
    //     this.messageToast('error', 'Error', 'Please refresh the page.');
    //   }
    // )
  }

  constructJsonToSend() {
    console.log(this.mainTableDataSource);
  }

  addKeyInData(data) {
    data.forEach(element => {
      element.uiSelected = '';
      element.selected_teacher = '';
    });
    return data;
  }

  getMetaDataForTable(data) {
    for (let i = 0; i < data.coursesList.length; i++) {
      this.mainTableDataSource.push(data.coursesList[i]);
    }
  }

  showNestedTableEdit(rowDetails, index) {
    document.getElementById(("show" + index).toString()).classList.add('nestedTableShow');
    document.getElementById(("show" + index).toString()).classList.remove('nestedTableHide');
    this.manipulateNestedTableDataSource(index);
  }

  manipulateNestedTableDataSource(index) {
    let test: any = this.mainTableDataSource[index].batchesList;
    this.nestedTableDataSource = this.keepCloning(this.subjectList);
    for (let i = 0; i < test.length; i++) {
      for (let y = 0; y < this.nestedTableDataSource.length; y++) {
        if (test[i].subject_id == this.nestedTableDataSource[y].subject_id) {
          this.nestedTableDataSource[y].uiSelected = true;
          this.nestedTableDataSource[y].selected_teacher = test[i].teacher_id;
          this.nestedTableDataSource[y].otherDetails = test[i];
        }
      }
    }
    this.mainTableDataSource[index].batchesList = this.nestedTableDataSource;
  }

  keepCloning(objectpassed) {
    if (objectpassed === null || typeof objectpassed !== 'object') {
      return objectpassed;
    }
    let temporaryStorage = objectpassed.constructor();
    for (var key in objectpassed) {
      temporaryStorage[key] = this.keepCloning(objectpassed[key]);
    }
    return temporaryStorage;
  }

  messageToast(errorType, errorTitle, errorMeassage) {
    let data = {
      type: errorType,
      title: errorTitle,
      body: errorMeassage
    }
    this.toastCtrl.popToast(data);
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
