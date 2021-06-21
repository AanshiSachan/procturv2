import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';



@Component({
  selector: 'app-view-salary-payment',
  templateUrl: './view-salary-payment.component.html',
  styleUrls: ['./view-salary-payment.component.scss']
})
export class ViewSalaryPaymentComponent implements OnInit {
  jsonFlag={
    institute_id:''
  }
  salaryModel={
    salary_type:'M',
    salary_grade:'',
    hourly_grade:'',
    basic_salary:'',
    overtime_rate:'',
    allowance:'',
    allowance_amount:'',
    deduction:'',
    deduction_amount:'',
    gross_salary:'',
    total_deduction:'',
    net_salary:'',
    typeA:'A',
    typeD:'D',
    template_id:'',
    user_gender:'',
    user_dob:'',
    user_phone:'',
    user_name:'',
    user_role:''


  }
  template_id:any
  salrayDataList:any=[]
  addedListAllownc:any=[]
  addedListDeduct:any=[]
  template_allowances_map_dtos:any=[]
  selectedTeacherId:any
  payment_date:any
  comment:any
  payment_method:any
  month:any
  payment_amount

  userId:any
  constructor( private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService, 
    private routeParam: ActivatedRoute,
    private location :Location) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
      // this.objectArray = sessionStorage.getItem('objectValue')
      this.comment = sessionStorage.getItem('viewComment')
     this.payment_date= sessionStorage.getItem('viewPayment_date')
    this.payment_method=sessionStorage.getItem('viewPayment_method')
    this.month=sessionStorage.getItem('viewMonth')
    this.payment_amount = sessionStorage.getItem('payment-amount')

    }
  ngOnInit(): void {
    this.routeParam.params.subscribe(params => {
      this.selectedTeacherId = params['teacher_id'];
      this.userId =params['user_id']
    });
    this.getViewResponse()
    console.log("obj value",this.payment_date)
    console.log("comment",this.comment)

  }
getViewResponse(){
  this.auth.showLoader();
  let url='/api/v1/payroll/manage/'+this.jsonFlag.institute_id+'/view/'+this.userId+'/'+this.selectedTeacherId
  this.http.getData(url).subscribe(
    (res :any)=>{
  this.salrayDataList=res.result.template_dto
  this.auth.hideLoader();
    this.salaryModel=res.result.template_dto
    this.salaryModel.user_name = res.result.user_name
    this.salaryModel .user_gender =res.result.user_gender
    this.salaryModel .user_dob=res.result.user_dob,
    this.salaryModel .user_phone=res.result.user_phone,
    this.salaryModel . user_name=res.result.user_name,
    this.salaryModel . user_role=res.result.user_role
    console.log("view details",this.salrayDataList)
  
  for(let i= 0; i < this.salrayDataList.template_allowances_map_dtos.length; i++){
    if(this.salrayDataList.template_allowances_map_dtos[i].type == 'D') {
       let obj ={
        type:this.salaryModel.typeD,
        deduction:this.salrayDataList.template_allowances_map_dtos[i].deduction,
        deduction_amount:this.salrayDataList.template_allowances_map_dtos[i].deduction_amount,
       }
         this.addedListDeduct.push(obj)
      } else {
           let obj2={
        type:this.salaryModel.typeA,
       allowance:this.salrayDataList.template_allowances_map_dtos[i].allowance,
       allowance_amount:this.salrayDataList.template_allowances_map_dtos[i].allowance_amount,
      
       }
       this.addedListAllownc.push(obj2)  
      }
      console.log("edit response",this.salrayDataList)
    }
    },
    err => {
      this.auth.hideLoader();
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.message);
    }
  )
}
backPage(){
this.location.back()
}
}
