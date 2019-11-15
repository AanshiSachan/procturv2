import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoursesServiceService } from '../../../../services/archiving-service/courses-service.service';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-students-archived-report',
  templateUrl: './students-archived-report.component.html',
  styleUrls: ['./students-archived-report.component.scss']
})
export class StudentsArchivedReportComponent implements OnInit {

  getStudents: any[] = []
  isRippleLoad: boolean
  PageIndex: number = 1;
  PageIndexPopup: number = 1;
  pagedisplaysize: number = 10;
  pagedisplaysizePopup: number = 10;
  totalRow: number = 0;
  newPaginated: any[] = [];
  searchText: string = ""
  searchData: any[] = [];
  searchflag: boolean = false;
  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  dataStatus: boolean;
  sortedenabled: boolean = true;
  sortedBy: string = "";
  direction = 0;
  arr: any = [];


  constructor(private students: CoursesServiceService,
    private appc: AppComponent,
    private router: Router
  ) { }

  ngOnInit() {
    this.studentsArchivedData();
  }

  studentsArchivedData() {
    this.isRippleLoad = true;
    this.dataStatus = true;
    this.students.archivedStudents().subscribe(
      (data: any) => {
        this.dataStatus = false;
        this.isRippleLoad = false;
        this.arr = data;
        this.totalRow = data.length;
        this.PageIndex = 1;
        this.fetchTableDataByPage(this.PageIndex);
      },
      (error: any) => {
        this.dataStatus = false;
        let msg = {
          type: "error",
          body: error.error.message
        }
        this.appc.popToast(msg);
      }
    )
  }

  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      this.PageIndex = 1;
      let searchRes: any;
      searchRes = this.arr.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.searchData = searchRes;
      this.totalRow = searchRes.length;
      this.searchflag = true;
      this.fetchTableDataByPage(this.PageIndex);
    }
    else {
      this.searchflag = false;
      this.totalRow = this.arr.length;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  sortedData(ev) {
    this.sortedenabled = true;
    if (this.sortedenabled) {
      (this.direction == 0 || this.direction == -1) ? (this.direction = 1) : (this.direction = -1);
      this.sortedBy = ev;
      this.arr = this.arr.sort((a: any, b: any) => {
        if (a[ev] < b[ev]) {
          return -1 * this.direction;
        }
        else if (a[ev] > b[ev]) {
          return this.direction;
        }
        else {
          return 0;
        }
      });

      this.PageIndex = 1;
      this.fetchTableDataByPage(this.PageIndex);
    }
  }

  getCaretVisiblity(e): boolean {

    if (this.sortedenabled && this.sortedBy == e) {
      return true;
    }

    else {
      return false;
    }
  }


  fetchTableDataByPage(index) {
    this.PageIndex = index;
    let startindex = this.pagedisplaysize * (index - 1);
    this.newPaginated = this.getDataFromDataSource(startindex);

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
    if (this.searchflag) {
      let t = this.searchData.slice(startindex, startindex + this.pagedisplaysize);
      return t;
    } else {
      let t = this.arr.slice(startindex, startindex + this.pagedisplaysize);
      return t;
    }
  }


}