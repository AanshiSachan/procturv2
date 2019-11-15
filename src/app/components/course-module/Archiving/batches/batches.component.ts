import { Component, OnInit } from '@angular/core';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { CoursesServiceService } from '../../../../services/archiving-service/courses-service.service';
import { AppComponent } from '../../../../app.component';
import { Router } from '@angular/router';


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
    archived: false
  }
  sendPayloadBatch = {
    batchIds: "",
    archived: false
  }
  courseIds: any[] = []
  checked: boolean;
  getArr: any[] = [];
  getId: any[] = [];
  dummyArr: any[] = [0, 1, 2, 0, 1, 2];
  columnMaps: any[] = [0, 1, 2, 3, 4, 5];
  columnMaps2: any[] = [0, 1, 2, 3, 4, 5 ,6, 7];
  dataStatus: boolean;

  sortedenabled: boolean = true;
  sortedBy: string = "";
  direction = 0;

  constructor(private auth: AuthenticatorService,
    private batch: CoursesServiceService,
    private appc: AppComponent,
    private router: Router) { }

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
    this.dataStatus = true;
    if (this.isProfessional) {
      this.batch.getBatches().subscribe(
        (data: any) => {
          this.dataStatus = false;
          this.getCourses = data;
          this.getCourses.map(
            (ele) => {
              ele.status = false
            }
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
    else {
      this.dataStatus = true;
      this.batch.getCoursesList().subscribe(
        (data: any) => {
          this.dataStatus = false;
          this.getCourses = data;
          this.getCourses.map(
            (ele) => {
              ele.status = false
            }
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
  }

  notifyMe(e) {
    let str = ""
    if (!this.isProfessional) {
      if (this.newPaginated[e].status == true) {
        this.getArr.push(this.newPaginated[e].course_id)
      }
      else {
        this.getArr = this.getArr.filter((ele) => {
          if (ele == this.newPaginated[e].course_id) {
            return false;
          } else {
            return true;
          }
        })
      }
      str = this.getArr.join(',');
      this.sendPayload.courseIds = str
    }
    else {
      if (this.newPaginated[e].status) {
        this.getArr.push(this.newPaginated[e].batch_id)
      }
      else {
        this.getArr = this.getArr.filter((ele) => {
          if (ele == this.newPaginated[e].batch_id) {
            return false;
          } else {
            return true;
          }
        })
      }
      str = this.getArr.join(',');
      this.sendPayloadBatch.batchIds = str
    }
  }

  archiveData(event) {

    if (!this.isProfessional) {
      if (this.sendPayload.courseIds == "" || this.sendPayload.courseIds == null) {
        let msg = {
          type: "error",
          body: "At least one course should be selected"
        }
        this.appc.popToast(msg);
      }
      else {
        if (confirm('Are you sure, you want to Archive?')) {
          this.batch.courses(this.sendPayload).subscribe(
            (data: any) => {
              this.router.navigateByUrl("/view/activity/archiving/batchesArchivedReport")
              let msg={
                type:"success",
                body:"Course(s) archived successfully"
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
    else {
      if (this.sendPayloadBatch.batchIds == "" || this.sendPayloadBatch.batchIds == null) {
        let msg = {
          type: "error",
          body: "At least one Batch should be selected"
        }
        this.appc.popToast(msg);
      }
      else {
        if (confirm('Are you sure, you want to Archive?')) {
          this.batch.batches(this.sendPayloadBatch).subscribe(
            (data: any) => {
              if(data.status_code == 202){
                if(confirm(data.message)){
                  this.sendPayloadBatch.archived = true;
                  this.batch.batches(this.sendPayloadBatch).subscribe(
                    (data: any) => {
                      this.router.navigateByUrl("/view/activity/archiving/batchesArchivedReport")
                      let msg={
                        type:"success",
                        body:"Batch(s) archived successfully"
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
              else{
                this.router.navigateByUrl("/view/activity/archiving/batchesArchivedReport")
                let msg={
                  type:"success",
                  body:"Batch(s) archived successfully"
                }
                this.appc.popToast(msg);
              }
            },
            (error: any) => {
              if(error.error.message.includes("Batch Already assigned with active Student")){
                if (confirm(error.error.message)) {
                    this.sendPayloadBatch.archived = true;
                    this.batch.batches(this.sendPayloadBatch).subscribe(
                      (data: any) => {
                        this.router.navigateByUrl("/view/activity/archiving/batchesArchivedReport")
                        let msg={
                          type:"success",
                          body:"Batch(s) archived successfully"
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
              else{
                let msg = {
                  type: "error",
                  body: error.error.message
                }
                this.appc.popToast(msg);
              }
            }
          )
        }
      }
    }
  }

  sortedData(ev) {
    this.sortedenabled = true;
    if (this.sortedenabled) {
      (this.direction == 0 || this.direction == -1) ? (this.direction = 1) : (this.direction = -1);
      this.sortedBy = ev;
      this.getCourses = this.getCourses.sort((a: any, b: any) => {
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
