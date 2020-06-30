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
  action: string = "-1";
  startDate: any = new Date(moment().date(1).format("YYYY-MM-DD"));
  endDate: any = moment(new Date).format("YYYY-MM-DD");

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

  assignAction(file_id){
    this.auth.showLoader();
    if(this.action == 'delete'){
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
          this.action = '-1';
        },
        err => {
          this.auth.hideLoader();
          this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
        }
      )
    }
    else if(this.action == 'manage'){
      this.router.navigate(['/view/course/online-assignment/manage-assignment/'+file_id]);
    }
    else if(this.action == 'status'){
      this.router.navigate(['/view/course/online-assignment/review-assignment/'+file_id]);
    }
  }

}
