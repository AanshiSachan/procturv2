import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { AuthenticatorService, HttpService, MessageShowService } from '../../..';
declare var $;


@Component({
  selector: 'app-leave-permission',
  templateUrl: './leave-permission.component.html',
  styleUrls: ['./leave-permission.component.scss']
})
export class LeavePermissionComponent implements OnInit {

  jsonFlag={
    institute_id:'',
    created_by:'',
    status :'APPROVED',

  }


  leaveApllicationmodel={
    appliedToUserId:'',
    userType:'',
    reason:'',
    status:'REJECTED',
    userid:1,
    id:0,
    pageSize:100,
    pageOffset:1,
    days:0,
    applicatioName:'',
    categoryName:'',
    from:moment(new Date()).format('YYYY-MM-DD'),
    to: moment(new Date()).format('YYYY-MM-DD'),
    type:{id:''}
  }

  varJson:any ={
    pageIndex:1,
    sizeArr:[5,25,50,100,150,200,500],
    displayBatchSize:25,
    total_item:0
  }
  leaveApplicationList:any[]=[]


  constructor( private msgService: MessageShowService,
    private httpService: HttpService,
    private router: Router,
    private auth: AuthenticatorService, private pdf: ExportToPdfService,) {
      this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
      this.jsonFlag.created_by = sessionStorage.getItem('userid')

     }
  ngOnInit(): void {
    this.getAllleaveApplication()

  }


  getAllleaveApplication(){
    
    this.auth.showLoader();
    const url1 ='/api/v2/leave-application/review/'+this.jsonFlag.institute_id+'/'+this.jsonFlag.created_by+'?'+ 'pageSize='+this.leaveApllicationmodel.pageSize+ '&' +'pageOffset='+this.leaveApllicationmodel.pageOffset;
    this.httpService.getData(url1).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.leaveApplicationList = res.result.response;
        this.varJson.total_item = this.leaveApplicationList.length;
        // alert(this.varJson.total_item)
        console.log("mrunali",this.leaveApplicationList)
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }
  
getPermissionLeave(obj){
  this.leaveApllicationmodel.id = obj
  

    // let obj ={
    //   status : this.leaveApllicationmodel.status,
    //   id:this.leaveApllicationmodel.id

    // }
    this.auth.showLoader();
    const url1 = '/api/v2/leave-application/'+this.jsonFlag.institute_id+'/'+'change-status'+'/'+this.leaveApllicationmodel.id+'?'+'status='+this.leaveApllicationmodel.status;
    this.httpService.getData(url1).subscribe(
      (res: any) => {
        console.log("delet obj",obj);
        // this.createdData=res.result
        this.auth.hideLoader();
  
        this.getAllleaveApplication()
  
        this.msgService.showErrorMessage('success', '', "Leave Application Rejected successfully");
  
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
      }
    )
  
  
  }

  approveLeave(obj){
    this.leaveApllicationmodel.id =obj
    this.auth.showLoader();
    const url1 = '/api/v2/leave-application/'+this.jsonFlag.institute_id+'/'+'change-status'+'/'+this.leaveApllicationmodel.id+'?'+'status='+this.jsonFlag.status;
    this.httpService.getData(url1).subscribe(
      (res: any) => {
        console.log("delet obj",obj);
        // this.createdData=res.result
        this.auth.hideLoader();
  
        this.getAllleaveApplication()
  
        this.msgService.showErrorMessage('success', '', "Leave Application Rejected successfully");
  
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )

  }
  downloadPdf(){
    let tepm =[]
    this.leaveApplicationList.map((e:any)=>{
      let obj =[
      e.applied_to_name,
      e.applied_by_role,
      e.type.name,
      e.applied_on,
      e.from,
      e.to,
      e.no_of_days,
      e.status
      ]
      tepm.push(obj)
     })
      let row=[]
      row=[["Application To","Role","Category","Date Applied","From","To","Days","Status"]]
      let column =[]
      column=tepm
      this.pdf.exportToPdf(row,column,'Leave_pdf')   
 
   
  }
 
}

