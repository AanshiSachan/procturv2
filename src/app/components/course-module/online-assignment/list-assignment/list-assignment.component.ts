import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../../services/authenticator.service';
import { HttpService  } from '../../../../services/http.service';
import { MessageShowService } from '../../../../services/message-show.service';
declare var $;
import * as moment from 'moment';

@Component({
  selector: 'app-list-assignment',
  templateUrl: './list-assignment.component.html',
  styleUrls: ['./list-assignment.component.scss']
})
export class ListAssignmentComponent implements OnInit {

  // global variables
  jsonFlag = {
    isProfessional: false,
    institute_id: '',
  };

  searchText: any;
  assignmentList: any[] = [];
  tempAssignmnetList: any[] = [];
  allData: any = [];  // used for pagination purpose
  startDate: any = new Date(moment().date(1).format("YYYY-MM-DD"));
  endDate: any = moment(new Date).format("YYYY-MM-DD");

  // FOR PAGINATION
  pageIndex: number = 1;
  displayBatchSize: number = 10;
  totalCount: number = 0;
  sizeArr: any[] = [20, 50, 100, 150, 200, 500];

  constructor(
    private msgService: MessageShowService,
    private httpService: HttpService,
    private router: Router,
    private auth: AuthenticatorService,
  ) {
    this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
  }

  ngOnInit() {
    this.getAssignmentList();
  }



  getAssignmentList(){
    let obj = {
      "institute_id": this.jsonFlag.institute_id,
    	"category_id": "255",
    	"course_id": -1,
    	"batch_id": -1,
    	"subject_id": -1,
    	"from_date": moment(this.startDate).format('YYYY-MM-DD'),
    	"to_date": moment(this.endDate).format('YYYY-MM-DD'),
    	"assignment_status": null
    }
    this.getAllAssignment(obj);
  }

  getAllAssignment(obj){
    this.auth.showLoader();
    const url = `/api/v2/onlineAssignment/getAssignmentsDetail`;
    this.httpService.postData(url, obj).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        if(res.statusCode >= 200 && res.statusCode < 300){
          this.assignmentList = res.result;
          this.tempAssignmnetList = res.result;
          this.allData = res.result;

          this.totalCount = this.allData.length;
          this.pageIndex = 1;
          this.fectchTableDataByPage(this.pageIndex);
        }
        else{
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', res.message);
        }
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  dateRangeChange(e) {
    this.startDate = moment(e[0]).format("YYYY-MM-DD");
    this.endDate = moment(e[1]).format("YYYY-MM-DD");
    let obj = {
      institute_id: this.jsonFlag.institute_id,
    	category_id: "255",
    	course_id: -1,
    	batch_id: -1,
    	subject_id: -1,
    	from_date: this.startDate,
    	to_date: this.endDate,
    	assignment_status: null
    }
    this.getAllAssignment(obj)
  }

  searchDatabase(){
    this.assignmentList = this.tempAssignmnetList;
    if (this.searchText == undefined || this.searchText == null) {
      this.searchText = "";
    }
    else {
      let searchData = this.tempAssignmnetList.filter(item =>
        Object.keys(item).some(
          k => item[k] != null && item[k].toString().toLowerCase().includes(this.searchText.toLowerCase()))
      );
      this.assignmentList = searchData;
    }
  }

  viewSubmission(file_id){
    this.router.navigate(['/view/course/online-assignment/review-assignment/'+file_id]);
  }

  editAssignment(file_id){
    this.router.navigate(['/view/course/online-assignment/manage-assignment/'+file_id]);
  }

  deleteAssignment(file_id){
    var prompt = confirm("Are you sure, you want to delete the assignment?");
    if (prompt) {
      this.auth.showLoader();
      let obj = {};
      const url = `/api/v2/onlineAssignment/delete/${this.jsonFlag.institute_id}/${file_id}`;
      this.httpService.deleteData(url, obj).subscribe(
        (res: any) => {
          if(res.statusCode >= "200" && res.statusCode < "300"){
            this.msgService.showErrorMessage('success', '', 'Assignment deleted successfully');
            this.getAssignmentList();
            this.router.navigate(['/view/course/online-assignment']);
          }
          else{
            this.msgService.showErrorMessage('error', '', res.message);
          }
          this.auth.hideLoader();
        },
        err => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
        }
      )
    }
  }


  /*** pagination functions */
  /* Fetch next set of data from server and update table */
  fetchNext() {
    this.pageIndex++;
    this.fectchTableDataByPage(this.pageIndex);
  }

  /* Fetch previous set of data from server and update table */
  fetchPrevious() {
    this.pageIndex--;
    this.fectchTableDataByPage(this.pageIndex);
  }

  /* Fetch table data by page index */
  fectchTableDataByPage(index) {
    this.pageIndex = index;
    let startindex = this.displayBatchSize * (index - 1);
    this.assignmentList = this.getDataFromDataSource(startindex);
  }

  // get  appropriate course planner data according to page
  getDataFromDataSource(startindex) {
    let t = this.allData.slice(startindex, startindex + this.displayBatchSize);
    return t;
  }

  /* Fetches Data as per the user selected batch size */
  updateTableBatchSize(num) {
    this.pageIndex = 1;
    this.displayBatchSize = parseInt(num);
    this.getAssignmentList();
  }

}
