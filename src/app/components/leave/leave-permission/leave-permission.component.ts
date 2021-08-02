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
    pageSize:10,
    pageOffset:1,
    pageIndex:1,

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
  
    total_item:0
  }
  leaveApplicationList:any[]=[]
  searchLeaveApplicationList:any=[]
  searchInput:any


  constructor( private msgService: MessageShowService,
    private httpService: HttpService,
    private router: Router,
    private auth: AuthenticatorService, private pdf: ExportToPdfService,) {
      this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
      this.jsonFlag.created_by = sessionStorage.getItem('userid')

     }
  ngOnInit(): void {
    this.getAllleaveApplication()
    this.fetchTableDataByPage(1)


  }

  fetchNext(){
    this.leaveApllicationmodel.pageOffset++;
    this.fetchTableDataByPage(this.leaveApllicationmodel.pageOffset)
  }
  
  fetchPrevious(){
    this.leaveApllicationmodel.pageOffset-- ;
    this.fetchTableDataByPage(this.leaveApllicationmodel.pageOffset)
  
  }
    
  fetchTableDataByPage(index){
    this.leaveApllicationmodel.pageOffset =index;
    this.getAllleaveApplication()
   
  }
  updateTableBatchSize(num) {
    this.leaveApllicationmodel.pageOffset = 1;
    this.leaveApllicationmodel.pageSize = parseInt(num);
    this.fetchTableDataByPage(this.leaveApllicationmodel.pageOffset);
  }
  
  
  getAllleaveApplication(){
    
    this.auth.showLoader();
    const url1 ='/api/v2/leave-application/review/'+this.jsonFlag.institute_id+'/'+this.jsonFlag.created_by+'?'+ 'pageSize='+this.leaveApllicationmodel.pageSize+ '&' +'pageOffset='+this.leaveApllicationmodel.pageOffset;
    this.httpService.getData(url1).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.leaveApplicationList = res.result.response;
        this.searchLeaveApplicationList=res.result.response;
        this.varJson.total_item = res.result.totalElements;
        for(let i=0; i < this.leaveApplicationList.length;i++){
          this.leaveApplicationList[i].no_of_days = this.leaveApllicationmodel.days;
        var  from = moment(this.leaveApplicationList[i].from);
         var to = moment(this.leaveApplicationList[i].to);
        let  diff= 1 + to.diff(from, 'days') // 1
          this.leaveApllicationmodel.days = diff;
          this.leaveApplicationList[i].no_of_days = diff;
        }
        
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
       
        this.auth.hideLoader();
  
        this.getAllleaveApplication()
  
        this.msgService.showErrorMessage('success', '', "Leave Application Approved successfully");
  
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )

  }
  downloadPdf(){
    for(let i = 0; i < this.leaveApplicationList.length; i++){
      this.leaveApplicationList[i].id = i+1;
    }
    let tepm =[]
    this.leaveApplicationList.map((e:any)=>{
      let obj =[
        e.id,
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
      row=[["#","Application To","Role","Category","Date Applied","From","To","Days","Status"]]
      let column =[]
      column=tepm
      this.pdf.exportToPdf(row,column,'Leave_pdf')   
 
   
  }
  searchInputs(){
    this.leaveApplicationList = this.searchLeaveApplicationList
  if( this.searchInput == undefined || this.searchInput == null){
this.searchInput = "";
  }else{
    
    let searchData = this.leaveApplicationList.filter(item => Object.keys(item).some(
      k =>item[k] != null && item[k].toString().toLowerCase().includes(this.searchInput.toLowerCase()))
    );
    this.leaveApplicationList = searchData;
  }
  }
 
}

