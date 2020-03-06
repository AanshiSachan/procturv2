import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../../app.component';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { CourseListService } from '../../../../services/course-services/course-list.service';


@Component({
  selector: 'app-course-course-list',
  templateUrl: './course-course-list.component.html',
  styleUrls: ['./course-course-list.component.scss']
})
export class CourseCourseListComponent implements OnInit {

  dummyArr: any[] = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5];
  courseListDataSource: any = [];
  studentListDataSource: any = [];
  feeTemplateDataSource: any = [];
  studentList: any = [];
  academicList: any = [];
  standardList: any = [];
  courseList: any = [];
  addStudentPopUp: boolean = false;
  allChecked: boolean = false;
  showTable: boolean = false;
  alertBox: boolean = true;
  delete_unpaid_fee: boolean = false;
  searchData: any = "";
  courseDetails: any;
  selectedRow: number;
  unselected_checkbox_id: number;
  PageIndex: number = 1;
  displayBatchSize: number = 10;
  totalRow: number;
  dataStatus: number = 1;
  searchFilter = {
    unassignFlag: '0',
    standard_id: -1,
  }

  jsonFlags = {
    isShowAddStudent: false,
    isShowAddCourse: false
  }

  constructor(
    private apiService: CourseListService,
    private auth:AuthenticatorService,
    private toastCtrl: AppComponent,
  ) {


  }

  ngOnInit() {
    this.checkTabSelection();
    this.getCourseListForTable();
    this.getStandardList();
    this.getAcademicYearDetails();
    this.checkUserHadAccess();
  }

  // USER permission
  checkUserHadAccess() {
    const permissionArray = sessionStorage.getItem('permissions');
    const usertype = sessionStorage.getItem('userType');
    if (permissionArray == null || permissionArray == "") {
      if (usertype == '0') {
        this.jsonFlags.isShowAddCourse = true;
        this.jsonFlags.isShowAddStudent = true;
      }
      else if (usertype == '3') {
        this.jsonFlags.isShowAddCourse = false;
        this.jsonFlags.isShowAddStudent = false;

      }
    }
    else {
      if (permissionArray != undefined) {
        if (permissionArray.indexOf('505') != -1) {
          // MASTER-Course - 505 has all access
          this.jsonFlags.isShowAddCourse = true;
          this.jsonFlags.isShowAddStudent = true;
        }
      }
    }
  }

  getCourseListForTable() {
    this.auth.showLoader();
    this.apiService.getCourseListFromServer().subscribe(
      (data: any) => {
        this.dataStatus = 2;
        this.courseListDataSource = data;
        this.totalRow = data.length;
        this.fetchTableDataByPage(this.PageIndex);
        this.auth.hideLoader();
        if (data.length > 0) {
          setTimeout(
            () => {
              this.toggleTbodyClass(0);
            }, 300
          );
        }
      },
      error => {
        this.dataStatus = 2;
        this.auth.hideLoader();
        this.messageToast('error', '', error.error.message);
      }
    )
  }

  getStandardList() {
    this.apiService.getStandardListFromServer().subscribe(
      res => {
        this.standardList = res;
      },
      err => {
      }
    )
  }

  // pagination functions
  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.courseList = this.getDataFromDataSource(startindex);
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
    let t = this.courseListDataSource.slice(startindex, startindex + this.displayBatchSize);
    return t;
  }

  sortTable(str) {
    if (str == "master_course" || str == "standard_name" || str == "coursee_names") {
      this.courseList.sort(function (a, b) {
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
  }

  rowSelectEvent(i) {
    this.selectedRow = i;
  }

  addStudentToBatch(rowDetails) {
    this.addStudentPopUp = true;
    this.courseDetails = rowDetails;
    console.log("courseDetails", rowDetails);
    // this.getAllStudentList();
    this.getAllFeeTemplate();
    // this.onRadioButtonChange();
  }

  // set default template and set 
  setDefaultTemplate(country_id, templates, data) {
    // templates[country_id] && templates[country_id].forEach(object => {
    //   if (object.is_default == 'Y' && data.assigned_fee_template_id == -1) {
    //     data.assigned_fee_template_id = object.template_id;
    //   }
    // });

    if (templates[country_id]) {
      let array = templates[country_id].filter(object => object.is_default == 'Y');
      if (data.assigned_fee_template_id == -1 && array.length) {
        data.assigned_fee_template_id = array[0].template_id;
      }
    }

    if (sessionStorage.getItem('enable_fee_template_country_wise') == '1') {
      let all_template = []
      let keys = Object.keys(templates);
      keys.forEach((key) => {
        all_template =[...all_template,...templates[key]];    
      });
      return all_template;
    } else {
      return templates[country_id];
    }


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

  getAllStudentList() {
    this.searchData = "";
    let unassign: any = "";
    if (this.searchFilter.unassignFlag == '2') {
      unassign = "Y";
    } else {
      unassign = "N";
    }
    let data = {
      course_id: this.courseDetails.course_id,
      standard_id: Number(this.searchFilter.standard_id),
      isUnassignedStudent: unassign
    }
    this.auth.showLoader();
    this.showTable = true;
    this.apiService.getStudentList(data).subscribe(
      (res: any) => {
        let clone: any = [];
        for (let i = 0; i < res.length; i++) {
          res[i]['immutableKey'] = res[i].assigned;
          clone.push(res[i]);
        }
        let data = this.makeTableJson(clone);
        this.studentListDataSource = this.keepCloning(data);
        this.studentList = data;
        this.getHeaderCheckBoxValue();
        this.auth.hideLoader();
      },
      error => {
        this.auth.hideLoader();
      }
    )
  }

  makeTableJson(res) {
    if (this.searchFilter.unassignFlag == '0') {
      return res;
    } else if (this.searchFilter.unassignFlag == '1') {
      let data = [];
      res.forEach(element => {
        if (element.assigned) {
          data.push(element);
        }
      });
      return data;
    } else {
      return res;
    }
  }


  getAllFeeTemplate() {
    this.apiService.getFeeTemplate(this.courseDetails.course_id).subscribe(
      res => {
        this.feeTemplateDataSource = res;
      },
      err => {
        //console.log(err);
      }
    )
  }

  saveChanges() {
    let checkAssignedCourseList = this.checkAssignedCourse();

    if (checkAssignedCourseList.length > 0) {
      let checkFlag = true;

      for (let i = 0; i < checkAssignedCourseList.length; i++) {
        if (checkAssignedCourseList[i] == 'false') {
          checkFlag = false;
          break;
        }
      }
      if (!checkFlag) {
        this.alertBox = false;
        // if (confirm('If you unassign a course from student then corresponding unpaid fee instalments will be deleted. Do you wish to continue?')) {
        //   this.apiToAllocateAndDeallocate();
        // }
        // else{
        //   let data = this.getCheckedRows();
        //   for (let i = 0; i < Object.keys(data).length; i++) {
        //     (document.getElementById("studentcheck"+Object.keys(data)[i]) as HTMLInputElement).checked = true;
        //   }
        // }
      }
      else {
        this.addStudentPopUp = false;
        this.apiToAllocateAndDeallocate();
      }

    }
    else {
      this.addStudentPopUp = false;
      this.showTable = false;
    }

  }

  unassign_course() {
    this.alertBox = true;
    this.apiToAllocateAndDeallocate();
  }

  closeAlert() {
    this.alertBox = true;
    this.delete_unpaid_fee = false;
    let data = this.getCheckedRows();
    for (let i = 0; i < Object.keys(data).length; i++) {
      (document.getElementById("studentcheck" + Object.keys(data)[i]) as HTMLInputElement).checked = true;
    }
  }

  getUISelectedRows(data) {
    let tempdata: any = [];
    data.forEach(element => {
      if (element.assigned) {
        tempdata.push(element);
      }
    });
    return tempdata;
  }

  apiToAllocateAndDeallocate() {
    this.auth.showLoader();
    let data = this.getCheckedRows();
    let dataToSend = {
      studentAssignedUnassigned_and_AcademicYearMapping: data,
      deleteCourse_SubjectUnPaidFeeSchedules: this.delete_unpaid_fee
    };
    // console.log(dataToSend)
    this.apiService.saveUpdatedList(dataToSend, this.courseDetails.course_id).subscribe(
      res => {
        this.messageToast('success', '', 'Student\'(s) added successfully');
        this.studentList = [];
        this.addStudentPopUp = false;
        this.auth.hideLoader();
        this.showTable = false;
      },
      err => {
        this.auth.hideLoader();
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
            break;
          }
        }
      }
    }
    return test;
  }

  checkAssignedCourse() {
    let test = [];
    for (let i = 0; i < this.studentListDataSource.length; i++) {
      for (let t = 0; t < this.studentList.length; t++) {
        if (this.studentList[t].student_id == this.studentListDataSource[i].student_id) {
          if (this.studentList[t].assigned != this.studentListDataSource[i].assigned) {
            test = [this.studentList[t].assigned.toString()];
            break;
          }
        }
      }
    }
    return test;
  }

  onRadioButtonChange() {
    this.searchData = "";
    this.studentList = [];
    this.studentListDataSource = [];
    this.getAllStudentList();
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
    this.alertBox = true;
    this.searchFilter = {
      unassignFlag: '0',
      standard_id: -1,
    };
    this.studentList = [];
    this.showTable = false;
    this.searchData = "";
  }

  selectAllCheckBox(element) {
    let val = element.checked;
    for (let i = 0; i < this.studentList.length; i++) {
      this.studentList[i].assigned = val;
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

  toggleTbodyClass(i) {
    document.getElementById('tbodyItem' + i) ? document.getElementById('tbodyItem' + i).classList.toggle("active") : '';
    document.getElementById('tbodyView' + i) ? document.getElementById('tbodyView' + i).classList.toggle("hide") : '';
  }

  messageToast(Errortype, Errortitle, message) {
    let msg = {
      type: Errortype,
      title: Errortitle,
      body: message
    }
    this.toastCtrl.popToast(msg);
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

}
