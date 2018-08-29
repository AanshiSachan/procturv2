import { Component, OnInit } from '@angular/core';
import { TeacherAPIService } from '../../../services/teacherService/teacherApi.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {

  teacherListDataSource: any = [];
  teacherList: any = [];
  PageIndex: number = 1;
  studentdisplaysize: number = 10;
  totalRow: number;
  searchData: any = [];
  searchDataFlag: boolean = false;
  isRippleLoad: boolean = false;
  dataStatus: number = 1;
  dummyArr: any[] = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5];
  selectedRow: number;
  searchValue: string = "";

  constructor(
    private ApiService: TeacherAPIService,
    private route: Router,
    private toastCtrl: AppComponent
  ) { }

  ngOnInit() {
    this.getDataFromServer();
  }

  getDataFromServer() {
    this.PageIndex = 1;
    this.isRippleLoad = true;
    this.ApiService.getAllTeacherList().subscribe(
      (data: any) => {
        this.dataStatus = 2;
        this.isRippleLoad = false;
        this.totalRow = data.length;
        this.teacherListDataSource = data;
        this.fetchTableDataByPage(this.PageIndex);
      },
      error => {
        this.dataStatus = 2;
        this.isRippleLoad = false;
        let data = {
          type: "error",
          title: "Error",
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
            title: "Deleted",
            body: "Faculty Deleted Successfully"
          }
          this.toastCtrl.popToast(data);
          this.getDataFromServer();
        },
        err => {
          //console.log(err);
          let data = {
            type: "error",
            title: "Error",
            body: err.error.message
          }
          this.toastCtrl.popToast(data);
        }
      )
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


}
