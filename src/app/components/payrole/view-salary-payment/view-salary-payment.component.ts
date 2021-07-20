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
  salaryModel:any={
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
    user_role:'',
    hourly_rate:'',
    payment_date:'',
  comment:'',
  payment_method:'',
  month:'',
  payment_amount:''


  }
  template_id:any
  salrayDataList:any=[]
  addedListAllownc:any=[]
  addedListDeduct:any=[]
  template_allowances_map_dtos:any=[]
  selectedTeacherId:any
  
  historyPaymentArr:any=[]=[]

  userId:any
  constructor( private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService, 
    private routeParam: ActivatedRoute,
    private location :Location) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
      // this.objectArray = sessionStorage.getItem('objectValue')
      
     this.salaryModel=JSON.parse(sessionStorage.getItem('history_obj'));
    //this.historyPaymentArr = sessionStorage.getItem(("historyPaymentResp"))
    this.historyPaymentArr  = JSON.parse(sessionStorage.getItem("historyPaymentResp"));//no brackets


    }
  ngOnInit(): void {
    this.routeParam.params.subscribe(params => {
      this.selectedTeacherId = params['teacher_id'];
      this.userId =params['user_id']
    });
    this.getViewResponse()
    console.log("obj valuewwwwwwww",this.historyPaymentArr)
    console.log("comment",this.salaryModel)

  }
getViewResponse(){
  // this.salaryModel.user_gender=this.salaryModel,
  // this.salaryModel.user_dob=this.salaryModel,
  //   this.salaryModel.user_phone=this.salaryModel,
    this.salaryModel.user_name=this.salaryModel.name,
    this.salaryModel.user_role=this.salaryModel.role,


  console.log(this.salaryModel);
    this.salaryModel.comment =this.salaryModel.comment
    this.salaryModel.payment_method =this.salaryModel.payment_method
    this.salaryModel.month=this.salaryModel.month,
    this.salaryModel.payment_amount=this.salaryModel.payment_amount,



    this.salaryModel.salary_type = this.salaryModel.template_dto.salary_type
   this.salaryModel.hourly_grade =this.salaryModel.template_dto.hourly_grade
    this.salaryModel.hourly_rate =this.salaryModel.template_dto.hourly_rate
    this.salaryModel.net_salary=this.salaryModel.template_dto.net_salary,
    this.salaryModel.overtime_rate=this.salaryModel.template_dto.overtime_rate,
    this.salaryModel.salary_grade=this.salaryModel.template_dto.salary_grade,
    this.salaryModel.total_deduction=this.salaryModel.template_dto.total_deduction,
    this.salaryModel.gross_salary=this.salaryModel.template_dto.gross_salary,
    this.salaryModel.basic_salary = this.salaryModel.template_dto.basic_salary

    this.salaryModel = this.salaryModel
    for(let i= 0; i < this.salaryModel.template_dto.template_allowances_map_dtos.length; i++){
      if(this.salaryModel.template_dto.template_allowances_map_dtos[i].type == 'D') {
         let obj ={
          type:this.salaryModel.typeD,
          deduction:this.salaryModel.template_dto.template_allowances_map_dtos[i].deduction,
          deduction_amount:this.salaryModel.template_dto.template_allowances_map_dtos[i].deduction_amount,
         }
           this.addedListDeduct.push(obj)
        } else {
             let obj2={
          type:this.salaryModel.typeA,
         allowance:this.salaryModel.template_dto.template_allowances_map_dtos[i].allowance,
         allowance_amount:this.salaryModel.template_dto.template_allowances_map_dtos[i].allowance_amount,
        
         }
         this.addedListAllownc.push(obj2)  
        }
      }

  }
  

backPage(){
this.location.back()
}
}
