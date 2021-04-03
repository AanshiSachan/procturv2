import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthenticatorService, HttpService, MessageShowService } from '../../..';
declare var $;


@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.scss']
})
export class LeaveApplicationComponent implements OnInit {

  @Output() closePopup = new EventEmitter<boolean>();

  jsonFlag = {
  institute_id: '',
  created_by:''
    };

    varJson:any ={
      pageIndex:1,
      sizeArr:[5,25,50,100,150,200,500],
      displayBatchSize:25,
      total_item:0
    }

    leaveApllicationmodel={
      appliedToUserId:'',
      userType:'',
      reason:'',
      userid:1,
      pageSize:100,
      pageOffset:1,
      days:0,
      applicatioName:'',
      categoryName:'',
      from:moment(new Date()).format('YYYY-MM-DD'),
      to: moment(new Date()).format('YYYY-MM-DD'),
      type:{id:''}
    }

    createdData:any[]=[]
leaveApplicationList:any[]=[]
leaveTypeList :any[]=[]
toApplicationList:any[]=[]
  constructor( private msgService: MessageShowService,
    private httpService: HttpService,
    private router: Router,
    private auth: AuthenticatorService) {
      this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
      this.jsonFlag.created_by = sessionStorage.getItem('userid')

     }

  ngOnInit(): void {
    this.getAllleaveType()
    this.getAllleaveApplication()
    this.getApplicationToList()

  }
fetchNext(){
  this.varJson.pageIndex ++;
  this.fetchTableDataByPage(this.varJson.pageIndex)
}

fetchPrevious(){
  this.varJson.pageIndex -- ;
  this.fetchTableDataByPage(this.varJson.pageIndex)

}
  
fetchTableDataByPage(index){
  this.varJson.pageIndex =index;
  let object ={
    "page_no":this.varJson.pageIndex,
    "no-of-record":this.varJson.displayBatchSize
  }
}



  getAllleaveApplication(){
    this.auth.showLoader();
    const url1 ='/api/v2/leave-application/applied/'+this.jsonFlag.institute_id+'/'+this.jsonFlag.created_by+'?'+ 'pageSize='+this.leaveApllicationmodel.pageSize+ '&' +'pageOffset='+this.leaveApllicationmodel.pageOffset;
    this.httpService.getData(url1).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.leaveApplicationList = res.result.response;
        console.log("mrunali",this.leaveApplicationList)
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

getApplicationToList(){
  this.auth.showLoader();
  const url1 = '/api/v1/profiles/'+this.jsonFlag.institute_id+'/user-by-type'+'?'+'Type='+this.leaveApllicationmodel.userType
  this.httpService.getData(url1).subscribe(
    (res: any) => {
      this.auth.hideLoader();
      this.toApplicationList = res.active_users;
      console.log("ApplicationList",this.toApplicationList)
    },
    err => {
      this.auth.hideLoader();
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
    }
  )
}

createLeaveApplication(){
  alert(this.leaveApllicationmodel.userType)
   
let obj ={
  applied_by_user_id :this.jsonFlag.created_by,
  applied_to_user_id:this.leaveApllicationmodel.applicatioName,
  from:this.leaveApllicationmodel.from,
  to:this.leaveApllicationmodel.to,
  no_of_days:this.leaveApllicationmodel.days, 
   type :{
    id :this.leaveApllicationmodel.categoryName
  },
institute_id: this.jsonFlag.institute_id,
reason:"",
}
 this.auth.showLoader();
  const url1 = '/api/v2/leave-application'
  this.httpService.postData(url1, obj).subscribe(
    (res: any) => {
      console.log("post data",obj)
      // this.createdData=res.result
      this.getAllleaveApplication()

      this.auth.hideLoader();
      if (res.statusCode == 200) {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Leave applied successfully');
        this.closePopups(false)
      this.leaveApllicationmodel.userType="",
      this.leaveApllicationmodel.applicatioName="",
      this.leaveApllicationmodel.from=""
      this.leaveApllicationmodel.to=""
  
      }
    },
    err => {
      this.auth.hideLoader();
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
    }
  )
}

closePopups($event) {
  $('#addModal').modal('hide');
  this.closePopup.emit(false);
}
}
