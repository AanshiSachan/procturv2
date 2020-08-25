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
  sizeArr: any[] = [25, 50, 100, 150, 200, 500, 1000];
  isProfessional: boolean;
  archivedData: any[] = [];
  PageIndex: number = 1;
  PageIndexPopup: number = 1;
  pagedisplaysize: number = 25;
  pagedisplaysizePopup: number = 10;
  totalRow: number = 0;
  newPaginated: any[] = [];
  searchText: string = ""
  searchData: any[] = [];
  searchflag: boolean = false;
  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5];
  columnMaps2: any[] = [0, 1, 2, 3, 4, 5, 6, 7];
  dataStatus: boolean;

  sortedenabled: boolean = true;
  sortedBy: string = "";
  direction = 0;

  constructor(private course: CoursesServiceService,
    private auth: AuthenticatorService,
    private appc: AppComponent) { }

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
    this.setTableData();
  }

  headerSetting: any;
  tableSetting: any;
  rowColumns: any;
  setTableData() {

    this.headerSetting = [
      {
        primary_key: 'course_name',
        value: "Course",
        charactLimit: 15,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'master_course',
        value: "Master Course",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'standard_name',
        value: "Standard",
        charactLimit: 15,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'subjects',
        value: "Subjects",
        charactLimit: 25,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'start_date',
        value: "Start Date",
        charactLimit: 20,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'end_date',
        value: "End Date",
        charactLimit: 20,
        sorting: false,
        visibility: true
      },
      {
        primary_key: 'status',
        value: "Status",
        charactLimit: 10,
        sorting: true,
        visibility: true
      },
      {
        primary_key: 'archived_date',
        value: "Archived Date Time",
        charactLimit: 20,
        sorting: false,
        visibility: true
      },

    ]
    this.tableSetting = {
      width: "100%",
      height: "69vh"
    }

    this.rowColumns = [
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "15%",
        textAlign: "left"
      },
      {
        width: "15%",
        textAlign: "left"
      },
      {
        width: "15%",
        textAlign: "left"
      },
      {
        width: "10%",
        textAlign: "left"
      },
      {
        width: "15%",
        textAlign: "left"
      },
    ]

    // if (this.isProfessional) {

    //   console.log("true block");
    //   this.headerSetting.push(
    //     {
    //       primary_key: 'batch_name',
    //       value: "Batch",
    //       charactLimit: 10,
    //       sorting: false,
    //       visibility: true
    //     },
    //     {
    //       primary_key: 'standard_name',
    //       value: "Master Course",
    //       charactLimit: 10,
    //       sorting: false,
    //       visibility: true
    //     },
    //     {
    //       primary_key: 'subject_name',
    //       value: "Course",
    //       charactLimit: 10,
    //       sorting: false,
    //       visibility: true
    //     });
    //   this.rowColumns.push(
    //     {
    //       width: "10%",
    //       textAlign: "left"
    //     },
    //     {
    //       width: "10%",
    //       textAlign: "left"
    //     },
    //     {
    //       width: "10%",
    //       textAlign: "left"
    //     },
    //   );
    // }
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
  updateTableBatchSize(event) {
    this.pagedisplaysize = event;
    this.fetchTableDataByPage(this.PageIndex);
  }

}
