import { Component, OnInit } from '@angular/core';
import { ManageBatchService } from '../../../services/course-services/manage-batch.service';
import { error } from 'util';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { setTimeout } from 'timers';
import { tr } from '../../../../assets/imported_modules/ngx-bootstrap/bs-moment/i18n/tr';

@Component({
  selector: 'app-manage-batch',
  templateUrl: './manage-batch.component.html',
  styleUrls: ['./manage-batch.component.scss']
})
export class ManageBatchComponent implements OnInit {

  createNewBatch: boolean = false;
  batchesListDataSource: any = [];
  tableData: any = [];
  classRoomList: any;
  teacherList: any;
  courseList: any = [];
  subjectList: any;
  addStudentPopUp: boolean = false;
  studentListDataSource: any = [];
  studentList: any = [];
  batchDetails: any;
  allChecked: boolean = false;
  isRippleLoad: boolean = false;
  editRowDetails: any = {
    standard_id: '',
    subject_id: '',
    teacher_id: '',
    class_room_id: ''
  };
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
  PageIndex: number = 1;
  displayBatchSize: number = 10;
  totalRow: number;
  searchedData: any = [];
  searchDataFlag: boolean = false;

  constructor(
    private apiService: ManageBatchService,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.getAllBatchesList()
    this.getMasterCourseList();
    this.getAllClassRoom();
    this.getAllTeacherList();
  }

  getAllBatchesList() {
    this.isRippleLoad = true;
    this.apiService.getBatchListFromServer().subscribe(
      (res: any) => {
        console.log('batch', res);
        this.batchesListDataSource = res;
        this.totalRow = res.length;
        this.fetchTableDataByPage(this.PageIndex);
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
        console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  editTableRow(rowDetails, index) {
    this.isRippleLoad = true;
    document.getElementById(("row" + index).toString()).classList.remove('displayComp');
    document.getElementById(("row" + index).toString()).classList.add('editComp');
    this.apiService.getBatchDetailsForEdit(rowDetails.batch_id).subscribe(
      data => {
        console.log(data);
        this.editRowDetails = data;
        this.onMasterCourseSelection(data.standard_id);
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
        console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  searchDatabase(element) {
    if (element.value != '' && element.value != null) {
      let searchData = this.batchesListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(element.value.toLowerCase()))
      );
      this.searchedData = searchData;
      this.searchDataFlag = true;
      this.totalRow = searchData.length;
      this.fetchTableDataByPage(this.PageIndex);
    } else {
      this.searchDataFlag = false;
      this.fetchTableDataByPage(this.PageIndex);
      this.totalRow = this.batchesListDataSource.length;
    }
  }

  togglecreateNewBatch() {
    if (this.createNewBatch == false) {
      this.createNewBatch = true;
      document.getElementById('showCloseBtn').style.display = '';
      document.getElementById('showAddBtn').style.display = 'none';
    } else {
      this.createNewBatch = false;
      document.getElementById('showCloseBtn').style.display = 'none';
      document.getElementById('showAddBtn').style.display = '';
    }
  }

  getAllClassRoom() {
    this.isRippleLoad = true;
    this.apiService.getBatchClassRoomListFromServer().subscribe(
      data => {
        console.log('ClassRoom List', data);
        this.classRoomList = data;
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
        console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  getAllTeacherList() {
    this.isRippleLoad = true;
    this.apiService.getTeachersListFromServer().subscribe(
      res => {
        console.log('TeacherList', res);
        this.teacherList = res;
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
        console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  getMasterCourseList() {
    this.isRippleLoad = true;
    this.apiService.getMasterCourseListFromServer().subscribe(
      res => {
        console.log('masterCourse', res);
        this.courseList = res;
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
        console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  onMasterCourseSelection(data) {
    this.isRippleLoad = true;
    if (data != '-1') {

      this.apiService.getPerticularCourseList(data).subscribe(
        res => {
          console.log('Subject List', res);
          this.subjectList = res;
          this.isRippleLoad = false;
        },
        error => {
          this.isRippleLoad = false;
          console.log(error);
          this.messageToast('error', 'Error', error.error.message);
        }
      )
    } else {
      this.isRippleLoad = false;
      this.messageToast('error', 'Error', 'You Can not select empty value');
      return;
    }
  }

  addNewBatchToList() {
    if (this.addNewBatch.batch_code.length > 4) {
      this.messageToast('error', 'Error', 'Batch Code can not be greater than 4 alphabet.');
      return;
    }
    if (this.addNewBatch.start_date == "" || this.addNewBatch.start_date == null) {
      this.messageToast('error', 'Error', 'Please Provide Start Date.');
      return;
    } else {
      this.addNewBatch.start_date = moment(this.addNewBatch.start_date).format("YYYY-MM-DD");
    }
    if (this.addNewBatch.end_date == "" || this.addNewBatch.end_date == null) {
      this.messageToast('error', 'Error', 'Please Provide End Date.');
      return;
    } else {
      this.addNewBatch.end_date = moment(this.addNewBatch.end_date).format("YYYY-MM-DD");
    }

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

  updateTableRow(rowDetails, index) {
    this.isRippleLoad = true;
    let dataToSend: any = {
      batch_code: rowDetails.batch_code,
      batch_name: rowDetails.batch_name,
      start_date: moment(rowDetails.start_date).format("YYYY-MM-DD"),
      end_date: moment(rowDetails.end_date).format("YYYY-MM-DD"),
      subject_id: this.editRowDetails.subject_id,
      teacher_id: this.editRowDetails.teacher_id,
      is_active: rowDetails.is_active,
      isStudentToBeInactivated: this.editRowDetails.isStudentToBeInactivated,
      class_room_id: this.editRowDetails.class_room_id,
    };
    if (dataToSend.start_date > dataToSend.end_date) {
      this.messageToast('error', 'Error', 'Provide valid dates.');
      return;
    }
    if (!(dataToSend.end_date > this.editRowDetails.end_date)) {
      this.messageToast('error', 'Error', 'Batch end date can only be extended.');
      return;
    }
    if (rowDetails.batch_code.length > 4) {
      this.messageToast('error', 'Error', 'Batch Code can not be greater than 4 digits.');
      return;
    }
    this.apiService.updateDataToServer(dataToSend, rowDetails.batch_id).subscribe(
      data => {
        console.log(data);
        document.getElementById(("row" + index).toString()).classList.remove('editComp');
        document.getElementById(("row" + index).toString()).classList.add('displayComp');
        this.messageToast('success', 'Updated', 'Details Updated Successfully.');
        this.getAllBatchesList();
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
        console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  cancelTableRow(rowDetails, index) {
    document.getElementById(("row" + index).toString()).classList.remove('editComp');
    document.getElementById(("row" + index).toString()).classList.add('displayComp');
    this.getAllBatchesList();
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

  addStudentToBatch(rowDetails) {
    this.addStudentPopUp = true;
    this.getAllStudentList(rowDetails);
    this.batchDetails = rowDetails;
  }

  getAllStudentList(rowDetails) {
    this.isRippleLoad = true;
    this.apiService.getStudentListFromServer(rowDetails.batch_id).subscribe(
      res => {
        console.log("Student list", res);
        this.studentListDataSource = this.keepCloning(res);
        this.studentList = res;
        this.getHeaderCheckBoxValue();
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
        console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  saveChanges() {
    this.isRippleLoad = true;
    let dataToSend = {
      batch_id: this.batchDetails.batch_id,
      studentArray: this.getCheckedRows(),
    };
    this.apiService.saveUpdatedList(dataToSend, this.batchDetails.batch_id).subscribe(
      res => {
        console.log(res);
        this.messageToast('success', 'Saved', 'Changes saved successfully.');
        this.studentList = [];
        this.addStudentPopUp = false;
        this.isRippleLoad = false;
      },
      err => {
        this.isRippleLoad = false;
        console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }

  getCheckedRows() {
    console.log(this.studentListDataSource);
    console.log(this.studentList);
    let test = {};
    for (let i = 0; i < this.studentListDataSource.length; i++) {
      for (let t = 0; t < this.studentList.length; t++) {
        if (this.studentList[t].student_id == this.studentListDataSource[i].student_id) {
          if (this.studentList[t].assigned != this.studentListDataSource[i].assigned) {
            test[this.studentList[t].student_id] = this.studentList[t].assigned;
          }
        }
      }
    }
    console.log(test);
    return test;
  }

  selectAllCheckBox(element) {
    let val = element.checked;
    for (let i = 0; i < this.studentList.length; i++) {
      this.studentList[i].assigned = val;
    }
  }


  searchStudent(element) {
    debugger
    if (element.value != '' && element.value != null) {
      let searchData = this.studentListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(element.value.toLowerCase()))
      );
      this.studentList = searchData;
    } else {
      this.studentList = this.studentListDataSource;
    }
  }

  closeStudentPopup() {
    this.addStudentPopUp = false;
  }

  changeDateFormat(date) {
    if (date != "" && date != null) {
      return moment(date).format("D-MMM-YYYY");
    }
  }

  getHeaderCheckBoxValue() {
    for (let i = 0; i < this.studentList.length; i++) {
      if (this.studentList[i].assigned == false) {
        this.allChecked = false;
        break
      }
      else {
        this.allChecked = true;
      }
    }
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

  sortTable(str) {
    if (str == "batch_name" || str == "standard_name" || str == "subject_name" || str == "teacher_name" || str == "is_active") {
      this.tableData.sort(function (a, b) {
        var nameA = a[str].toUpperCase(); // ignore upper and lowercase
        var nameB = b[str].toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;

      })
    }
    else if (str == "batch_code" || str == "class_room_name" || str == "total_students") {
      this.tableData.sort(function (a, b) {
        return a[str] - b[str];
      })
    }
    else if (str == "end_date" || str == "start_date") {
      this.tableData.sort(function (a, b) {
        return moment(a[str]).unix() - moment(b[str]).unix();
      })
    }
  }

  // pagination functions 

  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.tableData = this.getDataFromDataSource(startindex);
  }

  fetchNext() {
    this.PageIndex++;
    this.fetchTableDataByPage(this.PageIndex);
  }

  fetchPrevious() {
    if (this.PageIndex != 1) {
      this.PageIndex--;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  getDataFromDataSource(startindex) {
    let data: any = [];
    if (this.searchDataFlag == true) {
      data = this.searchedData.slice(startindex, startindex + this.displayBatchSize);
    } else {
      data = this.batchesListDataSource.slice(startindex, startindex + this.displayBatchSize);
    }
    return data;
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
