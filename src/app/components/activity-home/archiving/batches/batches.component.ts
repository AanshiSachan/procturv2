import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { CoursesServiceService } from '../../../../services/archiving-service/courses-service.service';
import { concat } from 'rxjs/observable/concat';
import { AppComponent } from '../../../../app.component';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.scss']
})
export class BatchesComponent implements OnInit {

  isProfessional: boolean = false;
  getCourses: any[] = [];
  PageIndex: number = 1;
  PageIndexPopup: number = 1;
  pagedisplaysize: number = 10;
  pagedisplaysizePopup: number = 10;
  totalRow: number = 0;
  newPaginated: any[] = [];
  searchText: string = ""
  searchData: any[] = [];
  searchflag: boolean = false;
  sendPayload = {
    courseIds: "",
    checked: false
  }
  courseIds: any[] = []
  checked: boolean = false;

  constructor(private auth: AuthenticatorService,
    private batch: CoursesServiceService ,
    private appc:AppComponent) { }

  ngOnInit() {
    this.auth.institute_type.subscribe(
      res => {
        if (res == 'LANG') {
          this.isProfessional = true;
        } else {
          this.isProfessional = false;
        }
      }
    )
    this.getCoursesList();
  }

  getCoursesList() {
    if (this.isProfessional) {
      this.batch.getBatches().subscribe(
        (data: any) => {
          this.getCourses = data;
          this.totalRow = data.length;
          this.PageIndex = 1;
          this.fetchTableDataByPage(this.PageIndex);
        }
      )
    }
    else {
      this.batch.getCoursesList().subscribe(
        (data: any) => {
          this.getCourses = data;
          this.totalRow = data.length;
          this.PageIndex = 1;
          this.fetchTableDataByPage(this.PageIndex);
        }
      )
    }
  }

  notifyMe(e, f) {
    this.courseIds.push(e);
    let arr = this.courseIds.join(',');
    this.sendPayload.courseIds = arr;
    console.log(f);
  }

  archiveData(event) {
    this.batch.courses(this.sendPayload).subscribe(
      (data: any) => {
        console.log(data);
      },
      (error: any) => {
        let msg={
          type:"error",
          body:error.error.message
        }
        this.appc.popToast(msg);
      }
    )
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
      let t = this.getCourses.slice(startindex, startindex + this.pagedisplaysize);
      return t;
    }
  }

  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      this.PageIndex = 1;
      let searchRes: any;
      searchRes = this.getCourses.filter(item =>
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
      this.totalRow = this.getCourses.length;
    }
  }

}
