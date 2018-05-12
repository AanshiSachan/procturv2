import { Component, OnInit } from '@angular/core';
import { ManageBatchService } from '../../../services/course-services/manage-batch.service';
import { error } from 'util';
import { AppComponent } from '../../../app.component';
import * as moment from 'moment';
import { setTimeout } from 'timers';

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
    standard_id: '-1',
    subject_id: '',
    class_room_id: '-1',
    teacher_id: '-1',
    batch_name: '',
    batch_code: '',
    start_date: '',
    end_date: '',
    is_active: true,
    is_exam_grad_feature: false
  }
  PageIndex: number = 1;
  displayBatchSize: number = 10;
  totalRow: number;
  searchedData: any = [];
  searchDataFlag: boolean = false;
  dataStatus: number = 1;
  dummyArr: any[] = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5];
  selectedRow: number;
  academicList: any = [];
  feeTemplateDataSource: any = [];
  deafultTemplate: any;
  studentUnAssigned: boolean = false;
  examGradeFeature: any = "";
  searchData: any = "";

  constructor(
    private apiService: ManageBatchService,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.checkTabSelection();
    this.examGradeFeature = JSON.parse(sessionStorage.getItem('institute_info')).is_exam_grad_feature;
    this.getAllBatchesList()
    this.getMasterCourseList();
    this.getAllClassRoom();
    this.getAllTeacherList();
    this.getAcademicYearDetails();
  }

  getAllBatchesList() {
    this.isRippleLoad = true;
    this.apiService.getBatchListFromServer().subscribe(
      (res: any) => {
        this.batchesListDataSource = res;
        this.totalRow = res.length;
        this.fetchTableDataByPage(this.PageIndex);
        this.isRippleLoad = false;
        this.dataStatus = 2;
      },
      error => {
        this.isRippleLoad = false;
        //console.log(error);
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
        //console.log(data);
        this.editRowDetails = data;
        this.onMasterCourseSelection(data.standard_id);
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
        //console.log(error);
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
    this.selectedRow = null;
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
        this.classRoomList = data;
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
        //console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  getAllTeacherList() {
    this.isRippleLoad = true;
    this.apiService.getTeachersListFromServer().subscribe(
      res => {
        this.teacherList = res;
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
        //console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  getMasterCourseList() {
    this.isRippleLoad = true;
    this.apiService.getMasterCourseListFromServer().subscribe(
      res => {
        this.courseList = res;
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
        //console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  onMasterCourseSelection(data) {
    this.isRippleLoad = true;
    if (data != '-1') {

      this.apiService.getPerticularCourseList(data).subscribe(
        res => {
          //console.log('Subject List', res);
          this.subjectList = res;
          this.isRippleLoad = false;
        },
        error => {
          this.isRippleLoad = false;
          //console.log(error);
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

    if (this.addNewBatch.teacher_id == "-1") {
      this.messageToast('error', 'Error', 'Provide provide faculty name.');
      return;
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
    if (this.addNewBatch.is_exam_grad_feature == true) {
      this.addNewBatch.is_exam_grad_feature = 1;
    } else {
      this.addNewBatch.is_exam_grad_feature = 0;
    }
    this.apiService.addNewBatch(this.addNewBatch).subscribe(
      res => {
        this.messageToast('success', 'Added Batch', "Successfully created batch.");
        this.clearFormData();
        this.getAllBatchesList();
        this.createNewBatch = false;
      },
      error => {
        //console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  updateTableRow(rowDetails, index) {
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
    let endDate = moment(this.editRowDetails.end_date).format("YYYY-MM-DD");
    if (!(dataToSend.end_date >= endDate)) {
      this.messageToast('error', 'Error', 'Batch end date can only be extended.');
      return;
    }
    if (rowDetails.batch_code.length > 4) {
      this.messageToast('error', 'Error', 'Batch Code can not be greater than 4 digits.');
      return;
    }
    this.isRippleLoad = true;
    this.apiService.updateDataToServer(dataToSend, rowDetails.batch_id).subscribe(
      data => {
        this.isRippleLoad = false;
        document.getElementById(("row" + index).toString()).classList.remove('editComp');
        document.getElementById(("row" + index).toString()).classList.add('displayComp');
        this.messageToast('success', 'Updated', 'Details Updated Successfully.');
        this.getAllBatchesList();
      },
      error => {
        this.isRippleLoad = false;
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
    this.batchDetails = rowDetails;
    this.getAllFeeTemplate();
    this.getAllStudentList(rowDetails);
  }

  getAcademicYearDetails() {
    this.academicList = [];
    this.apiService.getAcadYear().subscribe(
      res => {
        this.academicList = res;
      },
      err => {
      }
    )
  }

  getAllFeeTemplate() {
    this.apiService.getFeeTemplate(this.batchDetails.batch_id).subscribe(
      res => {
        this.feeTemplateDataSource = res;
        this.defaultTemplateDet(res);
      },
      err => {
        //console.log(err);
      }
    )
  }

  defaultTemplateDet(data) {
    data.forEach(element => {
      if (element.is_default == 1) {
        this.deafultTemplate = element;
      }
    });
  }

  getAllStudentList(rowDetails) {
    this.isRippleLoad = true;
    this.apiService.getStudentListFromServer(rowDetails.batch_id).subscribe(
      (res: any) => {
        res.forEach(element => {
          if (element.assigned_fee_template_id == -1) {
            if (this.deafultTemplate != null && this.deafultTemplate != "") {
              element.assigned_fee_template_id = this.deafultTemplate.template_id;
            }
          }
        });
        this.studentListDataSource = res;
        this.studentList = this.keepCloning(res);
        this.getHeaderCheckBoxValue();
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
        //console.log(error);
        this.messageToast('error', 'Error', error.error.message);
      }
    )
  }

  onCheckBoxClicked(data, event, index) {
    this.studentUnAssigned = false;
    let prevData: any = "";
    for (let i = 0; i < this.studentListDataSource.length; i++) {
      if (this.studentListDataSource[i].student_id == data.student_id) {
        prevData = this.studentListDataSource[i];
        if (prevData.assigned != event) {
          if (prevData.assigned == true && event == false) {
            // Student Unassigned
            this.studentUnAssigned = true;
          } else if (prevData.assigned == false && event == true) {
            // Student Assigned
            this.studentUnAssigned = false;
          }
        } else {
          // No Changes Performed
        }
      }
    }
  }

  saveChanges() {
    if (this.studentUnAssigned) {
      if (confirm("If you unassign the student from batch then corresponding unpaid fee instalments might be deleted.")) {
        this.saveStudentListToServer();
      }
    } else {
      this.saveStudentListToServer();
    }
  }

  saveStudentListToServer() {
    let data = this.getCheckedRows();
    let dataToSend = {
      batch_id: this.batchDetails.batch_id,
      studentAssignedUnassigned_and_AcademicYearMapping: data,
    };
    this.isRippleLoad = true;
    this.apiService.saveUpdatedList(dataToSend, this.batchDetails.batch_id).subscribe(
      res => {
        this.messageToast('success', 'Saved', 'Changes saved successfully.');
        this.studentList = [];
        this.addStudentPopUp = false;
        this.isRippleLoad = false;
        this.getAllBatchesList();
        this.searchData = "";
      },
      err => {
        this.isRippleLoad = false;
        //console.log(err);
        this.messageToast('error', 'Error', err.error.message);
      }
    )
  }

  getCheckedRows() {
    let test = {};
    for (let i = 0; i < this.studentListDataSource.length; i++) {
      for (let t = 0; t < this.studentList.length; t++) {
        if (this.studentList[t].student_id == this.studentListDataSource[i].student_id) {
          if (this.studentList[t].assigned != this.studentListDataSource[i].assigned) {
            test[this.studentList[t].student_id] = [this.studentList[t].assigned.toString(), this.studentList[t].academic_year.toString(), this.studentList[i].assigned_fee_template_id.toString()];
          }
        }
      }
    }
    return test;
  }

  selectAllCheckBox(element) {
    let val = element.checked;
    for (let i = 0; i < this.studentList.length; i++) {
      this.studentList[i].assigned = val;
    }
  }


  searchStudent(element) {
    if (element.value != '' && element.value != null) {
      let searchData = this.studentListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(element.value.toLowerCase()))
      );
      this.studentList = searchData;
      this.PageIndex = 1;
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

  rowSelectEvent(i) {
    if (this.createNewBatch == true) {
      this.selectedRow = null;
    } else {
      this.selectedRow = i;
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

  checkTabSelection() {
    setTimeout(() => {
      this.hideAllTabs();
      document.getElementById('liManageBatch').classList.add('active');
    }, 200)
  }

  hideAllTabs() {
    document.getElementById('liStandard').classList.remove('active');
    document.getElementById('liSubject').classList.remove('active');
    document.getElementById('liManageBatch').classList.remove('active');
    // document.getElementById('liExam').classList.add('hide');
    document.getElementById('liClass').classList.remove('active');
  }

  //  Role Based Access
  checkIfUserHadAccess() {
    let permissionArray = sessionStorage.getItem('permissions');
    let userType: any = Number(sessionStorage.getItem('userType'));
    if (userType != 3) {
      if (permissionArray == "" || permissionArray == null) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

}
