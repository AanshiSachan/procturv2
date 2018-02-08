import { Component, OnInit } from '@angular/core';
import { TeacherAPIService } from '../../../services/teacherService/teacherApi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {

  teacherListDataSource: any;
  teacherList: any;
  PageIndex: number = 1;
  studentdisplaysize: number = 10;
  totalRow: number;
  searchData: any = [];
  searchDataFlag: boolean = false;

  constructor(
    private ApiService: TeacherAPIService,
    private route: Router
  ) { }

  ngOnInit() {
    this.getDataFromServer();
  }

  getDataFromServer() {
    this.ApiService.getAllTeacherList().subscribe(
      (data: any) => {
        this.totalRow = data.length;
        this.teacherListDataSource = data;
        this.fetchTableDataByPage(this.PageIndex);
        console.log(data);
      },
      error => {
        console.log(error);
      }
    )
  }

  editTeacherDeatils(row) {
    localStorage.setItem('teacherID', row.teacher_id);
    this.route.navigateByUrl('teacher/edit');
  }

  viewTeacherActivity(row) {
    localStorage.setItem('teacherID', row.teacher_id);
    this.route.navigateByUrl('teacher/view');
  }

  searchTeacher(searchVal) {
    if (searchVal.value != "" && searchVal.value != null) {
      let searchData = this.teacherListDataSource.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(searchVal.value.toLowerCase()))
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
