import { Component, OnInit } from '@angular/core';
import { CoursesServiceService } from '../../../../services/archiving-service/courses-service.service';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  getStudents: any[] = [];
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
  columnMaps: any[] = [0, 1, 2, 3, 4, 5];
  dataStatus: boolean;
  courseFetchForm = {
    studentAlumniArrayString: "",
    studentIds: ""
  }

  status: boolean;
  getArr: any[] = []
  constructor(private students: CoursesServiceService,
    private appc: AppComponent) { }

  ngOnInit() {
    this.studentsData();
  }

  studentsData() {
    this.dataStatus = true;
    this.students.studentsArchiveData().subscribe(
      (data: any) => {
        this.dataStatus = false;
        this.getStudents = data;
        this.getStudents.map(
          (ele: any) => ele.status = false
        )
        this.getStudents.map(
          (ele: any) => ele.getAlumni = "-1"
        )
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


  getStatusValue(e) {
    let str = ""
    if (this.newPaginated[e].status == true) {
      this.getArr.push(this.newPaginated[e].student_id)
    }
    else {
      this.getArr = this.getArr.filter((ele) => {
        if (ele == this.newPaginated[e].student_id) {
          return false;
        } else {
          return true;
        }
      })
    }
    str = this.getArr.join(',');
    this.courseFetchForm.studentIds = str
  }

  valueChange(event, data, j) {

    let arr = [];
    let arr1 = [];
    let obj = {
      id: data.student_id,
      value: event
    }
    this.getArr.push(obj);
    arr = Array.from(new Set(this.getArr));
    this.getArr.push(obj);
    // arr = [(new Set(this.getArr.map(({ id }) => id)))];
    console.log(this.getArr[j].id);
    for (let i = 0; i < this.getArr.length; i++) {
      for (let j = 0; j < this.getArr.length; j++) {
        if (this.getArr[i].id != this.getArr[j].id) {
          return arr.push(this.getArr[i]);
        }
      }
    }
    console.log(arr);
  }

  studentsDataPost() {

    this.students.archiveStudents(this.courseFetchForm).subscribe(
      (data: any) => {
        console.log(data);
      },
      (error: any) => {
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
      searchRes = this.getStudents.filter(item =>
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
      this.fetchTableDataByPage(this.PageIndex);
      this.totalRow = this.getStudents.length;
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
      let t = this.getStudents.slice(startindex, startindex + this.pagedisplaysize);
      return t;
    }
  }



}
