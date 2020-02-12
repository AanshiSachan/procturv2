import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../../app.component';
import { CoursesServiceService } from '../../../../services/archiving-service/courses-service.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';

@Component({
  selector: 'app-courses-archived-report',
  templateUrl: './courses-archived-report.component.html',
  styleUrls: ['./courses-archived-report.component.scss']
})
export class CoursesArchivedReportComponent implements OnInit {

  isProfessional: boolean;
  archivedData:any[]=[];
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
  columnMaps2: any[] = [0, 1, 2, 3, 4, 5 ,6, 7];
  dataStatus: boolean;

  sortedenabled: boolean = true;
  sortedBy: string = "";
  direction = 0;

  constructor(private course: CoursesServiceService,
    private auth: AuthenticatorService,
    private appc: AppComponent ) { }

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
    this.getCoursesArchived();
  }

  getCoursesArchived() {
    this.dataStatus = true;
    this.auth.showLoader();
    if (this.isProfessional) {
      this.course.batchArchiveStatus().subscribe(
        (data: any) => {
          this.dataStatus = false;
          this.auth.hideLoader();
          this.archivedData = data;
          this.totalRow = data.length;
          this.PageIndex = 1;
          this.fetchTableDataByPage(this.PageIndex);
        },
        (error: any) => {
          this.dataStatus = false;
          this.auth.hideLoader();
          let msg = {
            type: "error",
            body: error.error.message
          }
          this.appc.popToast(msg);
        }
      )
    }
    else {
      this.auth.showLoader();
      this.course.courseArchiveStatus().subscribe(
        (data: any) => {
          this.dataStatus = false;
          this.auth.hideLoader();
          this.archivedData = data;
          this.totalRow = data.length;
          this.PageIndex = 1;
          this.fetchTableDataByPage(this.PageIndex);
        },
        (error: any) => {
          this.dataStatus = false;
          this.auth.hideLoader();
          let msg = {
            type: "error",
            body: error.error.message
          }
          this.appc.popToast(msg);
        }
      )
    }
  }

  searchDatabase() {
    if (this.searchText != "" && this.searchText != null) {
      this.PageIndex = 1;
      let searchRes: any;
      searchRes = this.archivedData.filter(item =>
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
      this.totalRow = this.archivedData.length;
    }
  }


  sortedData(ev) {
    this.sortedenabled = true;
    if (this.sortedenabled) {
      (this.direction == 0 || this.direction == -1) ? (this.direction = 1) : (this.direction = -1);
      this.sortedBy = ev;
      this.archivedData = this.archivedData.sort((a: any, b: any) => {
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
      let t = this.archivedData.slice(startindex, startindex + this.pagedisplaysize);
      return t;
    }
  }

}
