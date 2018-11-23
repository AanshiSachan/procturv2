import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoursesServiceService } from '../../../../services/archiving-service/courses-service.service';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  newPaginated: any[] = [];
  getStudents: any[] = [];
  searchData: any[] = [];
  arr = [];
  getArr: any[] = [];
  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5];
  PageIndex: number = 1;
  PageIndexPopup: number = 1;
  pagedisplaysize: number = 10;
  pagedisplaysizePopup: number = 10;
  totalRow: number = 0;
 
  searchText: string = ""
  checkedStatus: boolean;
  searchflag: boolean = false; 
  dataStatus: boolean;
  courseFetchForm = {
    studentAlumniArrayString: "Y",
    studentIds: ""
  }

  obj = {
    id: "",
    event: ""
  };
  obj2 = {}

  status: boolean; 
  checkedAlumni: boolean = true;
  sortedenabled: boolean = true;
  sortedBy: string = "";
  direction = 0;


  constructor(private students: CoursesServiceService,
    private appc: AppComponent,
    private router: Router) { }

  ngOnInit() {
    this.studentsData();
    this.courseFetchForm.studentAlumniArrayString == "Y";
  }

  studentsData() {
    this.dataStatus = true;
    this.students.studentsArchiveData().subscribe(
      (data: any) => {
        let arr = [];
        let str = ""
        this.dataStatus = false;
        this.getStudents = data;
        if (this.checkedAlumni == true) {
          for (let i = 0; i < this.getStudents.length; i++) {
            this.getStudents[i].alumni == "Y"
            arr.push(this.getStudents[i].alumni)
          }
          str = arr.join(',')
          this.courseFetchForm.studentAlumniArrayString = str;
        }
        else {
          for (let i = 0; i < this.getStudents.length; i++) {
            this.getStudents[i].alumni == "N"
            arr.push(this.getStudents[i].alumni)
          }
          str = arr.join(',')
          this.courseFetchForm.studentAlumniArrayString = str;
        }
        this.getStudents.map(
          (ele: any) => ele.status = false,
        )
        this.getStudents.map(
          (ele: any) => ele.alumni = "Y",
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

  valueChange(event, id, j) {
    let str = ""
    let arr = []
    this.obj = {
      id: id.student_id,
      event: event
    }
    this.arr.push(this.obj);
    for (let i = 0; i < this.arr.length; i++) {
      for (let j = i + 1; j < this.arr.length; j++) {
        if (this.arr[i].id === this.arr[j].id) {
          this.arr.splice(i, 1)
        }
      }
    }

    this.arr.map(
      (ele: any) => {
        arr.push(ele.event)
      }
    )
    str = arr.join(',')
    this.courseFetchForm.studentAlumniArrayString = str;
  }


  studentsDataPost() {
    let arr = [];
    let str = "";
    for (let i = 0; i < this.getStudents.length; i++) {
      if (this.getStudents[i].status == true) {
        arr.push(this.getStudents[i].alumni);
      }
    }
    str = arr.join(',');
    this.courseFetchForm.studentAlumniArrayString = str;

    if (confirm("The selected students and the related data will be archived and made inactive and cannot be recovered. Are you sure you want to proceed?")) {
      this.students.archiveStudents(this.courseFetchForm).subscribe(
        (data: any) => {
          this.router.navigateByUrl("/view/activity/archiving/studentsArchivedReport")
          let msg = {
            type: "success",
            body: "Students archived successfully"
          }
          this.appc.popToast(msg);
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
  }
  // studentsDataPost() {
  //  this.students.archive
  //
  // }

  getValueChanged(event) {
    let arr = []
    let str = ""
    if (event == true) {
      for (let i = 0; i < this.getStudents.length; i++) {
        this.getStudents[i].status = true;
        arr.push(this.getStudents[i].student_id)
      }
      str = arr.join(',')
      this.courseFetchForm.studentIds = str;
    }
    else {
      for (let i = 0; i < this.getStudents.length; i++) {
        this.getStudents[i].status = false;
      }
      arr = [];
      str = arr.join();
      this.courseFetchForm.studentIds = str;
    }
  }

  getAlumniValue(event) {
    let arr = [];
    let str = "";
    if (event == true) {
      for (let i = 0; i < this.getStudents.length; i++) {
        this.getStudents[i].alumni = "Y";
        arr.push(this.getStudents[i].alumni)
      }
      str = arr.join(',')
      this.courseFetchForm.studentAlumniArrayString = str;
    }
    else {
      for (let i = 0; i < this.getStudents.length; i++) {
        this.getStudents[i].alumni = "N";
        arr.push(this.getStudents[i].alumni)
      }
      str = arr.join(',')
      this.courseFetchForm.studentAlumniArrayString = str;
    }
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

  sortedData(ev) {
    this.sortedenabled = true;
    if (this.sortedenabled) {
      (this.direction == 0 || this.direction == -1) ? (this.direction = 1) : (this.direction = -1);
      this.sortedBy = ev;
      this.getStudents = this.getStudents.sort((a: any, b: any) => {
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
      let t = this.getStudents.slice(startindex, startindex + this.pagedisplaysize);
      return t;
    }
  }

}
