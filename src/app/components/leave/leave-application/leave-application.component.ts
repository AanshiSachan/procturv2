import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { AuthenticatorService, HttpService, MessageShowService } from '../../..';
import { from } from 'rxjs';
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
      total_item:0
    }

    leaveApllicationmodel={
      appliedToUserId:'',
      userType:'',
      reason:'',
      status:'CANCELLED',
      userid:1,
      id:0,
      pageSize:10 ,
      pageOffset:1,
      pageIndex:1,

      days:0,
      applicatioName:'',
      categoryName:'',
      from:moment(new Date()).format('YYYY-MM-DD'),
      to: moment(new Date()).format('YYYY-MM-DD'),
      type:{id:0}
    }

    createdData:any[]=[]
leaveApplicationList:any[]=[]
leaveTypeList :any[]=[]
toApplicationList:any[]=[]
  editResult: any;
  constructor( private msgService: MessageShowService,
    private httpService: HttpService,
    private router: Router,
    private auth: AuthenticatorService, private pdf: ExportToPdfService,) {
      this.jsonFlag.institute_id = sessionStorage.getItem('institution_id');
      this.jsonFlag.created_by = sessionStorage.getItem('userid')

     }

  ngOnInit(): void {
    this.getAllleaveType()
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
    // for(let i=0;this.toApplicationList.length;i++){
    //   this.toApplicationList[i].show_data = true;
    //   if(this.toApplicationList[i].applied_by_user_id == this.jsonFlag.created_by){
    //     this.toApplicationList[i].show_data = false;
    //   }
    // }
    this.auth.showLoader();
    const url1 ='/api/v2/leave-application/applied/'+this.jsonFlag.institute_id+'/'+this.jsonFlag.created_by+'?'+ 'pageSize='+this.leaveApllicationmodel.pageSize+ '&' +'pageOffset='+this.leaveApllicationmodel.pageOffset;
    this.httpService.getData(url1).subscribe(
      (res: any) => {
        this.auth.hideLoader();
        this.leaveApplicationList = res.result.response;
        this.varJson.total_item = res.result.totalElements;
        for(let i=0; i < this.leaveApplicationList.length;i++){
          this.leaveApplicationList[i].no_of_days = this.leaveApllicationmodel.days;
        var  from = moment(this.leaveApplicationList[i].from);
         var to = moment(this.leaveApplicationList[i].to);
        let  diff= 1 + to.diff(from, 'days') // 1
          this.leaveApllicationmodel.days = diff;
          this.leaveApplicationList[i].no_of_days = diff

        }

        //  alert(this.varJson.total_item)
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
      },
      err => {
        this.auth.hideLoader();
        this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
      }
    )
  }

getApplicationToList(obj){
  // for(let i=0;this.toApplicationList.length;i++){
  //   this.toApplicationList[i].show_data = true;
  //   if(this.toApplicationList[i].applied_by_user_id == this.jsonFlag.created_by){
  //     this.toApplicationList[i].show_data = false;
  //   }
  // }
  // for(let i=0;this.toApplicationList.length;i++){
  //   this.toApplicationList[i].applied_by_user_id != this.jsonFlag.created_by
  // }
  this.auth.showLoader();
  this.toApplicationList = [];
  const url1 = '/api/v1/profiles/'+this.jsonFlag.institute_id+'/user-by-type'+'?'+'type='+this.leaveApllicationmodel.userType
  this.httpService.getData(url1).subscribe(
    (res: any) => {
      this.auth.hideLoader();
      this.toApplicationList = res.active_users;
       this.toApplicationList =this.toApplicationList.filter(item =>item.user_id != this.jsonFlag.created_by);
     
    },
    err => {
      this.auth.hideLoader();
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err);
    }
  )
}

createLeaveApplication(){
  
  if(this.leaveApllicationmodel.userType.trim() != ''){
    if(this.leaveApllicationmodel.applicatioName.trim() != ''){
      if(this.leaveApllicationmodel.categoryName.trim() != ''){

        
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
     
      this.getAllleaveApplication()

      this.auth.hideLoader();
    
      if (res.statusCode == 200) {
        this.msgService.showErrorMessage(this.msgService.toastTypes.success, '', 'Leave applied successfully');
        this.closePopups(false)
    
      }
      this.leaveApllicationmodel.userType=''
      this.leaveApllicationmodel.applicatioName=''
      this.leaveApllicationmodel.categoryName=''
      this.leaveApllicationmodel.from=moment(new Date()).format('YYYY-MM-DD')
      this.leaveApllicationmodel.to=moment(new Date()).format('YYYY-MM-DD')
    },
    err => {
      this.auth.hideLoader();
      
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
    }
  )
  }else{
    this.msgService.showErrorMessage('error', '', 'Please Select Category');

  }}
  else{
    this.msgService.showErrorMessage('error', '', 'Please Select Application To');

  }}
  else{
    this.msgService.showErrorMessage('error', '', 'Please Select Role');

  }
 
  }
  



editLeaveRow(obj){
 this.leaveApllicationmodel.id = obj.id;
if(obj.applied_to_role == 'Faculty'){
  this.leaveApllicationmodel.userType= '3,9'
}else if(obj.applied_to_role == 'Staff'){
  this.leaveApllicationmodel.userType = '0'
}
  this.leaveApllicationmodel.applicatioName = obj.applied_to_user_id;
  this.leaveApllicationmodel.categoryName = obj.type.id;
  this.leaveApllicationmodel.from = obj.from;
  this.leaveApllicationmodel.to = obj.to;

this.getApplicationToList(this.leaveApllicationmodel.userType)
}

deleteRow(obj){
  this.leaveApllicationmodel.id = obj;
}

withdrowLeave(){
  let obj ={
    status : this.leaveApllicationmodel.status,
    id:this.leaveApllicationmodel.id
  }
  this.auth.showLoader();
  const url1 = '/api/v2/leave-application/'+this.jsonFlag.institute_id+'/'+'change-status'+'/'+this.leaveApllicationmodel.id+'?'+'status='+this.leaveApllicationmodel.status;
  this.httpService.getData(url1).subscribe(
    (res: any) => {
     
      this.auth.hideLoader();

      this.getAllleaveApplication()

      this.msgService.showErrorMessage('success', '', "Leave Application withdraw successfully");
      $('#withdrawModal').modal('hide');

    },
    err => {
      this.auth.hideLoader();
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
    }
  )


}





editLeaveApplication(){
  let obj={
    id :this.leaveApllicationmodel.id,
    applied_by_user_id:this.jsonFlag.created_by,
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
  this.httpService.putData(url1, obj).subscribe(
    (res: any) => {
     this. editResult = res
     
      this.auth.hideLoader();

      this.getAllleaveApplication()


      this.msgService.showErrorMessage('success', '', "Leave Application updated successfully");
      $('#editModal').modal('hide');
     

    },
    err => {
      this.auth.hideLoader();
      this.msgService.showErrorMessage(this.msgService.toastTypes.error, '', err.error.message);
    }
  )

}
 deletLeaveApplication(index:number){
   this.leaveApplicationList.splice(index,1)
   
 }
 
 downloadPdf(){
   for(let i =0;i<this.leaveApplicationList.length;i++){
     this.leaveApplicationList[i].id = i+1
   }
   let tepm =[]
   this.leaveApplicationList.map((e:any)=>{
     let obj =[
       e.id,
     e.applied_to_name,
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
     row=[["#","Application To","Category","Date Applied","From","To","Days","Status"]]
     let column =[]
     column=tepm
     this.pdf.exportToPdf(row,column,'Leave_pdf')   

  
 }
 


closePopups($event) {
  $('#addModal').modal('hide');
  this.closePopup.emit(false);
  
}
clear(){
  this.leaveApllicationmodel.userType=''
  this.leaveApllicationmodel.applicatioName=''
  this.leaveApllicationmodel.categoryName=''
  this.leaveApllicationmodel.from=moment(new Date()).format('YYYY-MM-DD')
  this.leaveApllicationmodel.to=moment(new Date()).format('YYYY-MM-DD')
  }
}
