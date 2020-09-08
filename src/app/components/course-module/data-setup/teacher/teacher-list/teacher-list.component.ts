import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AppComponent } from '../../../../../app.component';
import { AuthenticatorService } from '../../../../../services/authenticator.service';
import { TeacherAPIService } from '../../../../../services/teacherService/teacherApi.service';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {

  teacherListDataSource: any = [];
  teacherList: any = [];
  PageIndex: number = 1;
  studentdisplaysize: number = 25;
  totalRow: number;
  searchData: any = [];
  searchDataFlag: boolean = false;
  dataStatus: number = 1;
  isShoweOnlineExam: boolean = false;
  dummyArr: any[] = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5];
  selectedRow: number;
  searchValue: string = "";
  type: string = '';

  constructor(
    private ApiService: TeacherAPIService,
    private route: Router,
    private toastCtrl: AppComponent,
    private auth: AuthenticatorService
  ) { }

  ngOnInit() {
    let type = Number(sessionStorage.getItem('institute_setup_type'));
    this.isOnlineExamAllow(type);
    this.getDataFromServer();
    this.auth.institute_type.subscribe(
      res => {
        if (res == "LANG") {
          this.type = 'batch';
        } else {
          this.type = 'course';
        }
      }
    )
  }

  getDataFromServer() {
    this.PageIndex = 1;
    this.auth.showLoader();
    this.ApiService.getAllTeacherList().subscribe(
      (data: any) => {
        this.dataStatus = 2;
        this.auth.hideLoader();
        this.totalRow = data.length;
        this.teacherListDataSource = data;
        this.teacherListDataSource.forEach(element => {
          if (element.date_of_joining != "") {
            element.date_of_joining = moment(element.date_of_joining).format('DD-MMM-YYYY');
          }
        });
        this.fetchTableDataByPage(this.PageIndex);
      },
      error => {
        this.dataStatus = 2;
        this.auth.hideLoader();
        let data = {
          type: "error",
          title: "",
          body: error.error.message
        }
        this.toastCtrl.popToast(data);
      }
    )
  }

  deleteTeacherDeatils(row) {
    if (confirm("Are you sure, you want to delete this teacher?")) {
      this.ApiService.deleteTeacher(row.teacher_id).subscribe(
        res => {
          this.searchValue = "";
          this.searchDataFlag = false;
          let data = {
            type: "success",
            title: "",
            body: "Faculty Deleted Successfully"
          }
          this.toastCtrl.popToast(data);
          this.getDataFromServer();
        },
        err => {
          //console.log(err);
          let data = {
            type: "error",
            title: "",
            body: err.error.message
          }
          this.toastCtrl.popToast(data);
        }
      )
    }
  }
  isOnlineExamAllow(type) {
    this.isShoweOnlineExam = this.checkInstSetupType(type, 4);
  }
  checkInstSetupType(value, role): boolean {
    if (value != 0) {
      var start = 2;
      var count = 1;
      while (start != value) {
        count++;
        start = start + 2;
      }
      var arr = [0, 0, 0, 0, 0, 0, 0, 0];
      var s = count.toString(2);
      var k = 0;
      for (var i = s.length - 1; i >= 0; i--) {
        arr[k] = parseInt(s.charAt(i));
        k++;
      }

      switch (role) {
        case 2:
          if (arr[0] == 1)
            return true;
          break;

        case 4:
          if (arr[1] == 1)
            return true;
          break;

        case 8:
          if (arr[2] == 1)
            return true;
          break;

        case 16:
          if (arr[3] == 1)
            return true;
          break;
        case 32:
          if (arr[4] == 1)
            return true;
          break;
        case 64:
          if (arr[5] == 1)
            return true;
          break;

        case 128:
          if (arr[6] == 1)
            return true;
          break;
        case 256:
          if (arr[7] == 1)
            return true;
          break;
        default: return false;
      }
      return false;

    }
    else {
      return false;
    }
  }
  searchTeacher() {
    if (this.searchValue != "" && this.searchValue != null) {
      let searchData = this.teacherListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchValue.toLowerCase()))
      );
      this.searchData = searchData;
      this.totalRow = searchData.length;
      this.searchDataFlag = true;
      this.fetchTableDataByPage(this.PageIndex);
    } else {
      this.searchDataFlag = false;
      this.fetchTableDataByPage(this.PageIndex);
      this.totalRow = this.teacherListDataSource.length;
    }
  }

  rowSelectEvent(i) {
    this.selectedRow = i;
  }

  // pagination functions

  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.studentdisplaysize * (index - 1);
    this.teacherList = this.getDataFromDataSource(startindex);
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
    let data = [];
    if (this.searchDataFlag) {
      data = this.searchData.slice(startindex, startindex + this.studentdisplaysize);
    } else {
      data = this.teacherListDataSource.slice(startindex, startindex + this.studentdisplaysize);
    }
    return data;
  }
  updateTableBatchSize(event) {
    this.studentdisplaysize = event;
    this.fetchTableDataByPage(this.PageIndex);
  }


}
