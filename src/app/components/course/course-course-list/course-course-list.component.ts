import { Component, OnInit } from '@angular/core';
import { CourseListService } from '../../../services/course-services/course-list.service';
import { AppComponent } from '../../../app.component';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-course-course-list',
  templateUrl: './course-course-list.component.html',
  styleUrls: ['./course-course-list.component.scss']
})
export class CourseCourseListComponent implements OnInit {

  courseList: any = [];
  courseListDataSource: any = [];
  isRippleLoad: boolean = false;
  PageIndex: number = 1;
  displayBatchSize: number = 10;
  totalRow: number;
  dataStatus: number = 1;
  dummyArr: any[] = [0, 1, 2, 3, 4, 0, 1, 2, 3, 4];
  columnMaps: any[] = [0, 1, 2, 3];
  selectedRow: number;

  constructor(
    private apiService: CourseListService,
    private toastCtrl: AppComponent,
  ) { }

  ngOnInit() {
    this.getCourseListForTable();
  }

  getCourseListForTable() {
    this.isRippleLoad = true;
    this.apiService.getCourseListFromServer().subscribe(
      (data: any) => {
        console.log(data);
        this.courseListDataSource = data;
        this.totalRow = data.length;
        this.fetchTableDataByPage(this.PageIndex);
        this.isRippleLoad = false;
      },
      error => {
        this.isRippleLoad = false;
        console.log(error);
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

}
