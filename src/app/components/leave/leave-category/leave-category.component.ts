import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService, HttpService, MessageShowService } from '../../..';

@Component({
  selector: 'app-leave-category',
  templateUrl: './leave-category.component.html',
  styleUrls: ['./leave-category.component.scss']
})
export class LeaveCategoryComponent implements OnInit {

  jsonFlag={
    institute_id :''
  }

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
  getAllleaveType(){
    this.auth.showLoader();
    const url1 = '/api/v2/leave-type/all/'+this.jsonFlag.institute_id
    this.httpService.getData(url1).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.leaveTypeList = res;
        console.log("AAAAAAAAAAAA",this.leaveTypeList)
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }
}
