import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';


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
    month:'',
    total_hours:'',
    overtime_hours:'',
    payment_amount:'',
    payment_method:'',
    comment:'',

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
    });
 console.log("iddddd", this.selectedTeacherId)
    this.getHistoryPayement()
  }
getHistoryPayement(){
  let url='/api/v1/payroll/payment/history/'+this.jsonFlag.institute_id+'/paymentHistories/'+this.userId+'/0'
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
createSalaryPayment(){
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
      this.router.navigate(['/view/payrole/make-salary']);
      this.getHistoryPayement()
    },
    err => {
      this.auth.hideLoader();
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.message);
    }
  )
  }
}
