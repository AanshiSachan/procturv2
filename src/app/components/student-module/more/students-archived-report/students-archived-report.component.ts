import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AppComponent } from '../../../../app.component';
import { CoursesServiceService } from '../../../../services/archiving-service/courses-service.service';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { CommonServiceFactory } from '../../../../services/common-service';
import { HttpService } from '../../../../services/http.service';
declare var $;

@Component({
  selector: 'app-students-archived-report',
  templateUrl: './students-archived-report.component.html',
  styleUrls: ['./students-archived-report.component.scss']
})
export class StudentsArchivedReportComponent implements OnInit {

  getStudents: any[] = []
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
  stdetchForm: any = {
    from_date: moment().format("YYYY-MM-") + moment().daysInMonth(),
    to_date: moment(new Date()).format('YYYY-MM-DD')
  }
  downloadStudentReportAccess: boolean = false;


  constructor(
    private students: CoursesServiceService,
    private auth:AuthenticatorService,
    private appc: AppComponent,
    private router: Router,
    private _http: HttpService,
    private cd: ChangeDetectorRef,
    private _commService: CommonServiceFactory
  ) { }

  ngOnInit() {
    this.studentsArchivedData();
    this.checkDownloadRoleAccess();
  }

  checkDownloadRoleAccess() {
    if(sessionStorage.getItem('downloadStudentReportAccess')=='true'){
        this.downloadStudentReportAccess = true;
    }
}

  studentsArchivedData() {
    this.auth.showLoader();
    this.dataStatus = true;
    this.auth.showLoader();
    this.students.archivedStudents().subscribe(
      (data: any) => {
        this.auth.hideLoader();
        this.dataStatus = false;
        this.arr = data;
        this.totalRow = data.length;
        this.PageIndex = 1;
        this.fetchTableDataByPage(this.PageIndex);
      },
      (error: any) => {
        this.auth.hideLoader();
        this.dataStatus = false;
        let msg = {
          type: "error",
          body: error.error.message
        }
        this.appc.popToast(msg);
      }
    )
  }

  showDownloadDetails(){
    this.stdetchForm = {
      from_date: moment().format("YYYY-MM-01"),
      to_date: moment(new Date()).format('YYYY-MM-DD')
    }
    $("#actionProductModal").modal({
      backdrop: 'static',
      keyboard: false,
      show: true
    });
  }

  close_popup(){
    $("#actionProductModal").modal('hide');
  }


  fetchArchivedListDetails(){
        let url = "/api/v1/reports/StdFee/archived_inactive?institute_id=" + sessionStorage.getItem('institute_id');
        if((this.stdetchForm.to_date !='' &&this.stdetchForm.from_date !='')){
            url = url+'&&from_date='+moment(this.stdetchForm.from_date).format('YYYY-MM-DD');
            url = url+'&&to_date='+moment(this.stdetchForm.to_date).format('YYYY-MM-DD');
        }
        this.auth.showLoader();
        this._http.getData(url).subscribe((res: any) => {
          // console.log("fetchArchivedListDetails", res);
          this.auth.hideLoader();
          this.close_popup();
          if(res.validate){
            let result = res.result;
            let byteArr = this._commService.convertBase64ToArray(result.document);
            let fileName = result.docTitle;
            let file = new Blob([byteArr], { type: 'application/vnd.ms-excel' });
            let url = URL.createObjectURL(file);
            let dwldLink = document.getElementById('archived_download');
            this.cd.markForCheck();
            dwldLink.setAttribute("href", url);
            dwldLink.setAttribute("download", fileName);
            document.body.appendChild(dwldLink);
            this.cd.markForCheck();
            dwldLink.click();
            this.cd.markForCheck();
          } 

        }, err => {
          this.auth.hideLoader();
          let msg = {
            type: "info",
            body:err.error.message
          }
          this.appc.popToast(msg);
          this.close_popup();
        });

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