import { Component, OnInit } from '@angular/core';
import { ManageBatchService } from '../../../services/course-services/manage-batch.service';
import { error } from 'util';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';

@Component({
  selector: 'app-manage-batch',
  templateUrl: './manage-batch.component.html',
  styleUrls: ['./manage-batch.component.scss']
})
export class ManageBatchComponent implements OnInit {

  createNewBatch: boolean = false;
  batchesListDataSource: any;
  tableData: any = [];
  classRoomList: any;
  teacherList: any;
  courseList: any;
  subjectList: any;
  addNewBatch: any = {
    standard_id: '',
    subject_id: '',
    class_room_id: '',
    teacher_id: '',
    batch_name: '',
    batch_code: '',
    start_date: '',
    end_date: '',
    is_active: false,
  }

  constructor(
    private apiService: ManageBatchService,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.getAllBatchesList()
  }

  getAllBatchesList() {
    this.apiService.getBatchListFromServer().subscribe(
      (res: any) => {
        console.log(res);
        this.batchesListDataSource = res;
        this.tableData = res;
      },
      error => {
        console.log(error);

      }
    )
  }

  editTableRow(rowDetails) {
    debugger
    console.log(rowDetails);
  }

  searchDatabase(element) {
    if (element.value != '' && element.value != null) {
      let searchData = this.batchesListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(element.value.toLowerCase()))
      );
      this.tableData = searchData;
    } else {
      this.tableData = this.batchesListDataSource;
    }
  }

  togglecreateNewBatch() {
    if (this.createNewBatch == false) {
      this.createNewBatch = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';

      this.getMasterCourseList();
      this.getAllClassRoom();
      this.getAllTeacherList();

    } else {
      this.createNewBatch = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
  }

  getAllClassRoom() {
    this.apiService.getBatchClassRoomListFromServer().subscribe(
      data => {
        console.log('ClassRoom List', data);
        this.classRoomList = data;
      },
      error => {
        console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  getAllTeacherList() {
    this.apiService.getTeachersListFromServer().subscribe(
      res => {
        console.log('TeacherList', res);
        this.teacherList = res;
      },
      error => {
        console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  getMasterCourseList() {
    this.apiService.getMasterCourseListFromServer().subscribe(
      res => {
        console.log('masterCourse', res);
        this.courseList = res;
      },
      error => {
        console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  onMasterCourseSelection(event) {
    if (this.addNewBatch.standard_id != '-1') {

      this.apiService.getPerticularCourseList(this.addNewBatch.standard_id).subscribe(
        res => {
          console.log('Subject List', res);
          this.subjectList = res;
        },
        error => {
          console.log(error);
          this.messageToast('error', 'Error', error.error.message);
        }
      )
    } else {
      this.messageToast('error', 'Error', 'You Can not select empty value');
      return;
    }
  }

  addNewBatchToList() {
    debugger
    if (this.addNewBatch.batch_code.length > 4) {
      this.messageToast('error', 'Error', 'Batch Code can not be greater than 4 alphabet.');
      return;
    }
    this.addNewBatch.start_date = moment(this.addNewBatch.start_date).format("YYYY-MM-DD");
    this.addNewBatch.end_date = moment(this.addNewBatch.end_date).format("YYYY-MM-DD");
    if (this.addNewBatch.start_date > this.addNewBatch.end_date) {
      this.messageToast('error', 'Error', 'Provide valid details of Start Date.');
      return;
    }
    if (this.addNewBatch.is_active == true) {
      this.addNewBatch.is_active = 'Y';
    } else {
      this.addNewBatch.is_active = 'N';
    }
    this.addNewBatch.is_exam_grad_feature = 0;
    console.log(this.addNewBatch);
    this.apiService.addNewBatch(this.addNewBatch).subscribe(
      res => {
        console.log(res);
        this.messageToast('success', 'Added Batch', "Successfully created batch.");
        this.clearFormData();
        this.getAllBatchesList();
      },
      error => {
        console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  clearFormData() {
    this.addNewBatch = {
      standard_id: '',
      subject_id: '',
      class_room_id: '',
      teacher_id: '',
      batch_name: '',
      batch_code: '',
      start_date: '',
      end_date: '',
      is_active: false,
    }
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
