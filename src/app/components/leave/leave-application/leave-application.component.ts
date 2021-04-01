import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService, HttpService, MessageShowService } from '../../..';

@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.scss']
})
export class LeaveApplicationComponent implements OnInit {


  jsonFlag = {
    institute_id: '',
    
  };
leaveApplicationList:any[]=[]
leaveTypeList :any[]=[]
  constructor( private msgService: MessageShowService,
    private httpService: HttpService,
    private router: Router,
    private auth: AuthenticatorService) {
      this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');

     }

  ngOnInit(): void {
    this.getAllleaveType()

  }

  getAllleaveApplication(){
    this.auth.showLoader();
    const url1 = `/api/v1/expense/category/all/${this.jsonFlag.institute_id}?expense_category_type=3&is_active=Y`
    this.httpService.getData(url1).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.leaveApplicationList = res;
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

  getAllleaveType(){
    this.auth.showLoader();
    const url1 = '/api/v2/leave-type/all/'+this.jsonFlag.institute_id
    this.httpService.getData(url1).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.leaveTypeList = res.result;
        console.log("AAAAAAAAAAAA",this.leaveTypeList)
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }


}
