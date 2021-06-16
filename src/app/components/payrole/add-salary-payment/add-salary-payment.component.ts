import { Component, ModuleWithComponentFactories, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import * as moment from 'moment';


@Component({
  selector: 'app-add-salary-payment',
  templateUrl: './add-salary-payment.component.html',
  styleUrls: ['./add-salary-payment.component.scss']
})
export class AddSalaryPaymentComponent implements OnInit {
  jsonFlag={
    institute_id:'',
  }
  historyModel={
    month:moment(new Date()).format("YYYY-MM-DD"),
    total_hours:'',
    overtime_hours:'',
    payment_amount:'',
    payment_method:'',
    comment:'',
    history_id:'',
    net_salary:'',
    overtime_rate:'',
    gross_salary:'',
    total_deduction:'',
    salary_type:'',
    user_name:'',
    user_gender:'',
    user_dob:'',
    user_phone:'',
    user_role:'',


  }
  allHistoryPementList:any=[]
  userId:any
  selectedId:any
  selectedTeacherId:any
  constructor( private router: Router,
    private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService,
    private pdf :ExportToPdfService,
    private excel :ExcelService,private routeParam: ActivatedRoute) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
      this.selectedId = JSON.parse(sessionStorage.getItem('selectedId'));
      this.selectedTeacherId = sessionStorage.getItem('teacher_id')
      this.userId = sessionStorage.getItem('user_id')
    
    }
  ngOnInit(): void {
    this.routeParam.params.subscribe(params => {
      this.selectedTeacherId = params['teacher_id'];
      this.userId =params['user_id']
      console.log("rolr id",this.selectedId)
    });
 console.log("iddddd", this.selectedTeacherId)
    this.getHistoryPayement()
    this.getPaymentDetails()
  }
getHistoryPayement(){
  let url='/api/v1/payroll/payment/history/'+this.jsonFlag.institute_id+'/paymentHistories/'+this.userId+'/'+this.selectedTeacherId
  this.http.getData(url).subscribe(
    (res:any)=>{
      this.allHistoryPementList = res.result;
      console.log("histroy payemnttt",this.allHistoryPementList)
    },
     err => {
      this.auth.hideLoader();
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
    }
  )
}
getPaymentDetails(){
  let url='/api/v1/payroll/manage/'+this.jsonFlag.institute_id+'/view/'+this.userId+'/'+this.selectedTeacherId
  this.http.getData(url).subscribe(
    (res:any)=>{
      let payementDatails = res.result.template_dto;
      this.historyModel = payementDatails
      this.historyModel.user_name = res.result.user_name
    this.historyModel .user_gender =res.result.user_gender
    this.historyModel .user_dob=res.result.user_dob,
    this.historyModel .user_phone=res.result.user_phone,
    this.historyModel . user_name=res.result.user_name,
    this.historyModel . user_role=res.result.user_role
    
      console.log("histroy payemntttsssssss",payementDatails)
    },
     err => {
      this.auth.hideLoader();
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
    }
  )
}
createSalaryPayment(){
  if(this.validInput()){
  let obj ={
    user_id :this.userId,
    role_id :this.selectedId,
    teacher_id:this.selectedTeacherId,
    month:this.historyModel.month,
    institute_id:this.jsonFlag.institute_id,
    comment:this.historyModel.comment,
    payment_method:this.historyModel.payment_method,
    payment_amount:this.historyModel.payment_amount,
    overtime_hours:this.historyModel.overtime_hours,
    total_hours:this.historyModel.total_hours,

  }
  let url='/api/v1/payroll/payment/history/create'
  this.http.postData(url,obj).subscribe(
    res=>{
      this.auth.hideLoader()
      this.msgToast.showErrorMessage('success', '', "Salary Payment Added  successfully");
      //this.router.navigate(['/view/payrole/make-salary']);
      this.getHistoryPayement()
    },
    err => {
      this.auth.hideLoader();
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.message);
    }
  )
  }
}
  deletPayemt(obj){
    let history_id = obj
    this.historyModel.history_id = history_id
    this.auth.showLoader()
    let url='/api/v1/payroll/payment/history/'+this.jsonFlag.institute_id+'/delete/'+this.historyModel.history_id
    this.http.deleteDataById(url).subscribe(
      res=>{
        this.auth.hideLoader()
        this.msgToast.showErrorMessage('success', '', "Salary Payment deleted successfully");
       // this.router.navigate(['/view/payrole/make-salary']);
        this.getHistoryPayement()
      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.message);
      }
    )
  }
  onclickView(obj){
    let user_id;
    let teacher_id;
    if(this.selectedId == 0) {
      teacher_id = obj.teacher_id;
      user_id = 0;
    } else {
      teacher_id = 0;
      user_id = obj.user_id;
    }  
    this.router.navigateByUrl('view/payrole/view-salary-payment/' +teacher_id + '/' + user_id)

  }
  validInput(){
//     if(this.historyModel.comment.trim()==''){
//       this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Enter Comment');
// return;
//     }
    if(this.historyModel.payment_amount.trim()==''){
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Enter Payment Ammount');
      return;

    }if(this.historyModel.payment_method == ""){
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Select Payment Method');
return;
    }
    return true
  }
}
