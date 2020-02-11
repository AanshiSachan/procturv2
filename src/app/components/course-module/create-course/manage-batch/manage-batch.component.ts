import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AppComponent } from '../../../../app.component';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { ManageBatchService } from '../../../../services/course-services/manage-batch.service';

@Component({
  selector: 'app-manage-batch',
  templateUrl: './manage-batch.component.html',
  styleUrls: ['./manage-batch.component.scss']
})
export class ManageBatchComponent implements OnInit {


  batchesListDataSource: any = [];
  tableData: any = [];
  courseList: any = [];
  studentListDataSource: any = [];
  studentList: any = [];
  searchedData: any = [];
  dummyArr: any[] = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5,0];
  academicList: any = [];
  feeTemplateDataSource: any = [];
  dataTable: any = [];
  classRoomList: any;
  teacherList: any;
  subjectList: any;
  batchDetails: any;
  PageIndex: number = 1;
  displayBatchSize: number = 10;
  totalRow: number;
  dataStatus: number = 1;
  selectedRow: number;
  unselected_checkbox_id: number;
  examGradeFeature: any = "";
  searchData: any = "";
  radioOption: string = '0';
  searchDataFlag: boolean = false;
  alertBox: boolean = true;
  delete_unpaid_fee: boolean = false;
  addStudentPopUp: boolean = false;
  createNewBatch: boolean = false;
  allChecked: boolean = false;
  editRowDetails: any = {
    standard_id: '',
    subject_id: '',
    teacher_id: '',
    class_room_id: ''
  };
  addNewBatch: any = {
    standard_id: '-1',
    subject_id: '-1',
    class_room_id: '-1',
    teacher_id: '-1',
    batch_name: '',
    batch_code: '',
    start_date: '',
    end_date: '',
    is_active: true,
    academic_year_id:'-1',
    is_exam_grad_feature: false
  }



  constructor(
    private apiService: ManageBatchService,
    private toastCtrl: AppComponent,
    private auth:AuthenticatorService,
  ) { }

  ngOnInit() {
    this.checkTabSelection();
    this.examGradeFeature = sessionStorage.getItem('is_exam_grad_feature');
    this.getAllBatchesList()
    this.getMasterCourseList();
    this.getAllClassRoom();
    this.getAllTeacherList();
    this.getAcademicYearDetails();
  }

  getAllBatchesList() {
    this.auth.showLoader();
    this.batchesListDataSource = [];
    this.tableData = [];
    this.apiService.getBatchListFromServer().subscribe(
      (res: any) => {
        this.batchesListDataSource = res;
        this.totalRow = res.length;
        this.fetchTableDataByPage(this.PageIndex);
        this.auth.hideLoader();
        this.dataStatus = 2;
      },
      error => {
        this.auth.hideLoader();
        //console.log(error);
        this.messageToast('error', '', error.error.message);
      }
    )
  }

  editTableRow(rowDetails, index) {
    this.auth.showLoader();
    document.getElementById(("row" + index).toString()).classList.remove('displayComp');
    document.getElementById(("row" + index).toString()).classList.add('editComp');
    this.apiService.getBatchDetailsForEdit(rowDetails.batch_id).subscribe(
      data => {
        //console.log(data);
        this.editRowDetails = data;
        this.onMasterCourseSelection(data.standard_id);
        this.auth.hideLoader();
      },
      error => {
        this.auth.hideLoader();
        //console.log(error);
        this.messageToast('error', '', error.error.message);
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

 // set default template and set 
 setDefaultTemplate(country_id, templates, data) {
  templates[country_id] && templates[country_id].forEach(object => {
    if (object.is_default == 'Y'&& data.assigned_fee_template_id == -1) {
      data.assigned_fee_template_id = object.template_id;
    }
  });
  return templates[country_id];
}

  getAllClassRoom() {
    this.auth.showLoader();
    this.apiService.getBatchClassRoomListFromServer().subscribe(
      data => {
        this.classRoomList = data;
        this.auth.hideLoader();
      },
      error => {
        this.auth.hideLoader();
        //console.log(error);
        this.messageToast('error', '', error.error.message);
      }
    )
  }

  getAllTeacherList() {
    this.auth.showLoader();
    this.apiService.getTeachersListFromServer().subscribe(
      res => {
        this.teacherList = res;
        this.auth.hideLoader();
      },
      error => {
        this.auth.hideLoader();
        //console.log(error);
        this.messageToast('error', '', error.error.message);
      }
    )
  }

  getMasterCourseList() {
    this.auth.showLoader();
    this.apiService.getMasterCourseListFromServer().subscribe(
      res => {
        this.courseList = res;
        this.auth.hideLoader();
      },
      error => {
        this.auth.hideLoader();
        //console.log(error);
        this.messageToast('error', '', error.error.message);
      }
    )
  }

  onMasterCourseSelection(data) {
    this.auth.showLoader();
    this.addNewBatch.subject_id = '-1';
    if (data != '-1') {

      this.apiService.getPerticularCourseList(data).subscribe(
        res => {
          //console.log('Subject List', res);
          this.subjectList = res;
          this.auth.hideLoader();
        },
        error => {
          this.auth.hideLoader();
          //console.log(error);
          this.messageToast('error', '', error.error.message);
        }
      )
    } else {
      this.auth.hideLoader();

      this.messageToast('error', '', 'You Can not select empty value');
      return;
    }
  }


  addNewBatchToList() {
    if (this.addNewBatch.standard_id != '-1') {

      if (this.addNewBatch.subject_id != "-1") {

        if (this.addNewBatch.teacher_id != "-1") {

          if (this.addNewBatch.batch_name.trim() != '') {
            if (this.addNewBatch.batch_code.length < 5) {

              if (this.addNewBatch.start_date != "" && this.addNewBatch.start_date != null) {
                this.addNewBatch.start_date = moment(this.addNewBatch.start_date).format("YYYY-MM-DD");

                if (this.addNewBatch.end_date != "" && this.addNewBatch.end_date != null) {
                  this.addNewBatch.end_date = moment(this.addNewBatch.end_date).format("YYYY-MM-DD");

                  if (this.addNewBatch.start_date < this.addNewBatch.end_date) {

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
                        this.messageToast('success', 'Added Batch', "Batch created successfully!");
                        this.clearFormData();
                        this.getAllBatchesList();
                        this.togglecreateNewBatch();
                      },
                      error => {
                        //console.log(error);
                        this.messageToast('error', '', error.error.message);
                      }
                    )
                  }
                  else {
                    this.messageToast('error', '', 'Provide valid details of Start Date');
                    return;
                  }
                } else {
                  this.messageToast('error', '', 'Please Provide End Date');
                  return;
                }
              } else {
                this.messageToast('error', '', 'Please Provide Start Date');
                return;
              }
            }
            else {
              this.messageToast('error', '', 'Batch Code can not be greater than 4 alphabet');
              return;
            }
          }
          else {
            this.messageToast('error', '', 'Provide batch name');
            return;
          }
        } else {
          this.messageToast('error', '', 'Provide  faculty name');
          return;
        }
      }
      else {
        this.messageToast('error', '', 'select course');
        return;
      }
    }
    else {
      this.messageToast('error', '', 'Select master course');
    }

  }


  updateTableRow(rowDetails, index) {
    let dataToSend: any = {
      batch_code: rowDetails.batch_code,
      batch_name: rowDetails.batch_name,
      start_date: moment(rowDetails.start_date).format("YYYY-MM-DD"),
      end_date: moment(rowDetails.end_date).format("YYYY-MM-DD"),
      subject_id: this.editRowDetails.subject_id,
      teacher_id: Number(rowDetails.teacher_id),
      is_active: rowDetails.is_active,
      isStudentToBeInactivated: this.editRowDetails.isStudentToBeInactivated,
      class_room_id: this.editRowDetails.class_room_id,
      academic_year_id:this.editRowDetails.academic_year_id
    };
    if (dataToSend.start_date > dataToSend.end_date) {
      this.messageToast('error', '', 'Provide valid dates.');
      return;
    }
    let endDate = moment(this.editRowDetails.end_date).format("YYYY-MM-DD");
    if (!(dataToSend.end_date >= endDate)) {
      this.messageToast('error', '', 'Batch end date can only be extended.');
      return;
    }
    if (rowDetails.batch_code.length > 4) {
      this.messageToast('error', '', 'Batch Code can not be greater than 4 digits.');
      return;
    }
    if (rowDetails.teacher_id == 0 || rowDetails.teacher_id == null || rowDetails.teacher_id == "") {
      this.messageToast('error', '', 'Please enter the faculty for the batch.');
      return;
    }
    this.auth.showLoader();
    this.apiService.updateDataToServer(dataToSend, rowDetails.batch_id).subscribe(
      data => {
        this.auth.hideLoader();
        document.getElementById(("row" + index).toString()).classList.remove('editComp');
        document.getElementById(("row" + index).toString()).classList.add('displayComp');
        this.messageToast('success', 'Updated', 'Details Updated Successfully.');
        this.getAllBatchesList();
      },
      error => {
        this.auth.hideLoader();
        this.messageToast('error', '', error.error.message);
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
      standard_id: '-1',
      subject_id: '-1',
      class_room_id: '-1',
      teacher_id: '-1',
      batch_name: '',
      batch_code: '',
      start_date: '',
      end_date: '',
      is_active: true,
      academic_year_id:'-1',
      is_exam_grad_feature: false
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
    this.apiService.getFeeTemplate(this.batchDetails.subject_id).subscribe(
      res => {
        this.feeTemplateDataSource = res;
      },
      err => {
        //console.log(err);
      }
    )
  }

  getAllStudentList(rowDetails) {
    this.auth.showLoader();
    this.apiService.getStudentListFromServer(rowDetails.batch_id).subscribe(
      (res: any) => {
        this.radioOption = '0';
        res.map(element => {
          element.immutableKey = element.assigned;
        });
        this.studentListDataSource = res;
        this.studentList = this.keepCloning(res);
        this.dataTable = this.studentList;
        this.getHeaderCheckBoxValue(this.dataTable);
        this.auth.hideLoader();
      },
      error => {
        this.auth.hideLoader();
        this.messageToast('error', '', error.error.message);
      }
    )
  }

  onRadioButtonChange() {
    this.searchData = "";
    if (this.studentList.length > 0) {
      if (this.radioOption == '0') {
        this.dataTable = this.studentList;
      } else if (this.radioOption == '1') {
        this.dataTable = this.studentList.filter(
          el => el.assigned == true
        )
      } else {
        this.dataTable = this.studentList.filter(
          el => el.assigned == false
        )
      }
      this.getHeaderCheckBoxValue(this.dataTable);
    } else {
      this.dataTable = [];
    }
  }

  checkIfStudentUnassigned() {
    let check = false;
    for (let i = 0; i < this.studentListDataSource.length; i++) {
      for (let j = 0; j < this.studentList.length; j++) {
        if (this.studentListDataSource[i].assigned) {
          if (this.studentList[j].assigned == false && this.studentListDataSource[i].student_id == this.studentList[j].student_id) {
            check = true;
            break;
          }
        }
      }
    }
    return check;
  }


  saveChanges() {
    let studentUnAssigned = this.checkIfStudentUnassigned();
    if (studentUnAssigned) {
      this.alertBox = false;
      // if (confirm("If you unassign the student from batch then corresponding unpaid fee instalments might be deleted.")) {
      //   this.saveStudentListToServer();
      // }
    } else {
      this.saveStudentListToServer();
    }
  }

  closeAlert() {
    this.alertBox = true;
    this.delete_unpaid_fee = false;
    let data = this.getCheckedRows();
    for (let i = 0; i < Object.keys(data).length; i++) {
      (document.getElementById("studentcheck" + Object.keys(data)[i]) as HTMLInputElement).checked = true;
    }
  }

  unassign_course() {
    this.alertBox = true;
    this.saveStudentListToServer();
  }

  saveStudentListToServer() {
    let data = this.getCheckedRows();
    let dataToSend = {
      batch_id: this.batchDetails.batch_id,
      studentAssignedUnassigned_and_AcademicYearMapping: data,
      deleteCourse_SubjectUnPaidFeeSchedules: this.delete_unpaid_fee
    };
    this.auth.showLoader();
    // console.log(dataToSend)
    this.apiService.saveUpdatedList(dataToSend, this.batchDetails.batch_id).subscribe(
      res => {
        this.messageToast('success', 'Saved', 'Changes saved successfully.');
        this.studentList = [];
        this.addStudentPopUp = false;
        this.auth.hideLoader();
        this.getAllBatchesList();
        this.searchData = "";
      },
      err => {
        this.auth.hideLoader();
        //console.log(err);
        this.messageToast('error', '', err.error.message);
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

  closeStudentPopup() {
    this.addStudentPopUp = false;
    this.searchData = "";
    this.alertBox = true;
  }

  changeDateFormat(date) {
    if (date != "" && date != null) {
      return moment(date).format("D-MMM-YYYY");
    }
  }

  getHeaderCheckBoxValue(res) {
    for (let i = 0; i < res.length; i++) {
      if (res[i].assigned == false) {
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
    document.getElementById('liClass').classList.remove('active');
  }

  //  Role Based Access
  checkIfUserHadAccess() {
    let permissionArray = sessionStorage.getItem('permissions');
    let userType: any = Number(sessionStorage.getItem('userType'));
    if (userType != 3) {
      if (permissionArray == "" || permissionArray == null) {
        return false;
      }
      else if (permissionArray.indexOf('401') != -1) {
        return false;
      }
      else {
        return true;
      }
    }
    else if (userType == 3) {
      return true;
    }
  }

}
