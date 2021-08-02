import { Component, ModuleWithComponentFactories, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ExportToPdfService } from '../../../services/export-to-pdf.service';
import { ExcelService } from '../../../services/excel.service';
import * as moment from 'moment';
import { Location } from '@angular/common';



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
    total_hours:0,
    overtime_hours:'',
    payment_amount:0,
    payment_method:'',
    comment:'',
    history_id:'',
    net_salary:0,
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
  sal_month= moment(new Date()).format('YYYY-MM')
  allHistoryPementList:any=[]
  searchList:any=[]
  userId:any
  selectedId:any
  selectedTeacherId:any
  payment_date:any
  payment_method:any
  comment:any
  month:any
  searchInput:any
  template_id:any
  constructor( private router: Router,
    private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService,
    private pdf :ExportToPdfService,
    private excel :ExcelService,
    private routeParam: ActivatedRoute,
    private location: Location) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
      this.selectedId = JSON.parse(sessionStorage.getItem('selectedId'));
      this.selectedTeacherId = sessionStorage.getItem('teacher_id')
      this.userId = sessionStorage.getItem('user_id')
      this.template_id = sessionStorage.getItem('template_id')
    
    }
  ngOnInit(): void {
    this.routeParam.params.subscribe(params => {
      this.selectedTeacherId = params['teacher_id'];
      this.userId =params['user_id']
      console.log("rolr id",this.selectedId)
    });
    this.getHistoryPayement()
    this.getPaymentDetails()
  }
getHistoryPayement(){
  let url='/api/v1/payroll/payment/history/'+this.jsonFlag.institute_id+'/paymentHistories/'+this.userId+'/'+this.selectedTeacherId
  this.http.getData(url).subscribe(
    (res:any)=>{
      this.allHistoryPementList = res.result;
      this.searchList=res.result;
      console.log("histroy payemnttt",this.allHistoryPementList)
      console.log("payement date",this.payment_method)

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
      this.historyModel =  res.result.template_dto;
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
    month:moment(this.sal_month).format('YYYY-MM'),
    institute_id:this.jsonFlag.institute_id,
    comment:this.historyModel.comment,
    payment_method:this.historyModel.payment_method,
    payment_amount:this.historyModel.payment_amount,
    overtime_hours:this.historyModel.overtime_hours,
    total_hours:this.historyModel.total_hours,
    template_id:this.template_id

  }
  let url='/api/v1/payroll/payment/history/create'
  this.http.postData(url,obj).subscribe(
    res=>{
      this.auth.hideLoader()
      this.msgToast.showErrorMessage('success', '', "Salary Payment Added  successfully");
      //this.router.navigate(['/view/payrole/make-salary']);
      this.clearForm()
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
    if (confirm('Are you sure, You want  to delete this template?')) {

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
    this.comment=obj.comment
    this.payment_date=obj.payment_date
    this.payment_method=obj.payment_method
    this.month=obj.month,
    this.historyModel.payment_amount=obj.payment_amount
    console.log("month",obj)
    // sessionStorage.setItem('viewComment',(this.comment))
    // sessionStorage.setItem('viewPayment_date',(this.payment_date))
    // sessionStorage.setItem('viewPayment_method',(this.payment_method))
    // sessionStorage.setItem('viewMonth',(this.month))
    sessionStorage.setItem('history_obj',JSON.stringify(obj));
    this.router.navigateByUrl('view/payrole/view-salary-payment/' +teacher_id + '/' + user_id)

  }
  validInput(){

    if(this.historyModel.payment_method == ""){
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Select Payment Method');
return;
    }
    return true
  }

   searchInputs(){
    this.allHistoryPementList=this.searchList 
    if(this.searchInput == undefined || this.searchInput == null){
      this.searchInput ="";
    }else{
      let searchData = this.allHistoryPementList.filter(item=>Object.keys(item).some(k=>item[k]!=null && item[k].toString().toLowerCase().includes
      (this.searchInput.toLowerCase())));
      this.allHistoryPementList = searchData
    }


   }
  clearForm(){
    this.historyModel.comment=""
    this.historyModel.payment_method=""
    this.historyModel.total_hours=0
    this.historyModel.payment_amount=0
    this.sal_month= moment(new Date()).format('YYYY-MM')

    
  }
  backPage(){
    this.location.back()
    }
    onOpenCalendar(container) {
 container.monthSelectHandler = (event: any): void => {
   container._store.dispatch(container._actions.select(event.date));
 };     
 container.setViewMode('month');
}
calcPaymentAmont(){
  
  this.historyModel.payment_amount = this.historyModel.net_salary * this. historyModel.total_hours
}
}
