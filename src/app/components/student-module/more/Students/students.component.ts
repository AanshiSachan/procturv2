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
  selectedStudents = [];
  // selectedAlumanies = [];
  PageIndex: number = 1;
  PageIndexPopup: number = 1;
  pagedisplaysize: number = 10;
  pagedisplaysizePopup: number = 10;
  totalRow: number = 0;
  direction = 0;
  sortedBy: string = "";
  searchText: string = ""
  checkedStatus: boolean =false;
  searchflag: boolean = false;
  checkedAlumni: boolean = true;
  sortedenabled: boolean = true;
  dataStatus: boolean;
  status: boolean;
  courseFetchForm = {
    studentAlumniArrayString: "Y",
    studentIds: "",
    archivedStudent: true

  }
  obj = {
    id: "",
    event: ""
  };
  obj2 = {}
  checkedStudentIds: any[] = [];

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
        this.sortedData('student_disp_id');
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


  getStatusValue(event,e) {
    let arr = this.checkedStudentIds;
    let str = "";
    let index=0;
    let i = 0;
    let length = (10 * this.PageIndex);
    if (this.PageIndex == 1) {
      i = 0;
    }
    else {
      i = length - (this.pagedisplaysize);
    }

    if (event == true) {
      if(this.searchflag){
        for ( i; (i < length && i < this.newPaginated.length); i++) {
          if (this.newPaginated[i].student_id === e.student_id ) {
            this.newPaginated[i].status = true;
            arr.push(this.newPaginated[i].student_id);
          }
          if(this.newPaginated[i].status) {
            index++;
          }
        }
      }
      else{
        for ( i; (i < length && i < this.getStudents.length); i++) {
          if (this.getStudents[i].student_id === e.student_id ) {
            this.getStudents[i].status = true;
            arr.push(this.getStudents[i].student_id);
          }
          if(this.getStudents[i].status) {
            index++;
          }
        }
      }
    }
    else {
      if(this.searchflag){
        for (i; (i < length && i < this.newPaginated.length); i++) {
          if (this.newPaginated[i].student_id === e.student_id ) {
            this.newPaginated[i].status = false;
          }
          else{
            index++;
            arr.push(this.newPaginated[i].student_id);
          }
        }
      }
      else{
        for (i; (i < length && i < this.getStudents.length); i++) {
          if (this.getStudents[i].student_id === e.student_id ) {
            this.getStudents[i].status = false;
          }
          else{
            index++;
            arr.push(this.getStudents[i].student_id);
          }
        }
      }
    }
    this.checkedStatus =  index==10?true:false;
    str = arr.join(',');
    this.courseFetchForm.studentIds = str;
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


  studentsDataPost(e) {
    let arr = [];
    let str = "";
    for (let i = 0; i < this.getStudents.length; i++) {
      if (this.getStudents[i].status == true) {
        arr.push(this.getStudents[i].alumni);
      }
    }
    str = arr.join(',');
    this.courseFetchForm.studentAlumniArrayString = str;
    this.courseFetchForm.archivedStudent = true;

    if(str == "" || str == null){
      let msg = {
        type: "error",
        body: "At least one student should be selected"
      }
      this.appc.popToast(msg);
    }
    else{
      if (confirm("If the selected student(s) are archived, the related data can not be recovered. \nDo you wish to archive the student(s) ?")) {
        // console.log(this.courseFetchForm)
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
  }

  getValueChanged(event) {
    let i = 0;
    let length = (10 * this.PageIndex);
    if (this.PageIndex == 1) {
      i = 0;
    }
    else {
      i = length - (this.pagedisplaysize);
    }

    let arr = [];
    let str = "";
    if (event == true) {
      if(this.searchflag){
        for (i; i < length; i++) {
          if (i < this.newPaginated.length) {
            this.newPaginated[i].status = true;
          }
          arr.push(this.newPaginated[i].student_id);
        }
        str = arr.join(',')
        this.selectedStudents.push(this.PageIndex);
        this.checkedStatus = true;
        this.courseFetchForm.studentIds = str;
      }
      else{
        for (i; i < length; i++) {
          if (i < this.getStudents.length) {
            this.getStudents[i].status = true;
          }
          arr.push(this.getStudents[i].student_id);
        }
        str = arr.join(',')
        this.selectedStudents.push(this.PageIndex);
        this.checkedStatus = true;
        this.courseFetchForm.studentIds = str;
      }
    }
    else {
      if(this.searchflag){
        for (i; i < length; i++) {
          if (i < this.newPaginated.length) {
            this.newPaginated[i].status = false;
          }
        }
        arr = [];
        str = arr.join();
        this.selectedStudents.splice(this.selectedStudents.indexOf(this.PageIndex), 1);
        this.checkedStatus = false;
        this.courseFetchForm.studentIds = str;
      }
      else{
        for (i; i < length; i++) {
          if (i < this.getStudents.length) {
            this.getStudents[i].status = false;
          }
        }
        arr = [];
        str = arr.join();
        this.selectedStudents.splice(this.selectedStudents.indexOf(this.PageIndex), 1);
        this.checkedStatus = false;
        this.courseFetchForm.studentIds = str;
      }
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
      this.checkedStatus = (this.selectedStudents.length>0)&& (this.selectedStudents.indexOf(this.PageIndex)!= -1) ? true : false;
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
    // console.log(this.selectedStudents.indexOf(this.PageIndex))
    this.checkedStatus = (this.selectedStudents.length>0)&& (this.selectedStudents.indexOf(this.PageIndex)!= -1) ? true : false;
    // this.checkedAlumni =  this.selectedAlumanies.indexOf(this.PageIndex) ? true : false;
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
