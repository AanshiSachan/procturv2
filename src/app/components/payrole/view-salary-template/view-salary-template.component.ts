import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';


@Component({
  selector: 'app-view-salary-template',
  templateUrl: './view-salary-template.component.html',
  styleUrls: ['./view-salary-template.component.scss']
})
export class ViewSalaryTemplateComponent implements OnInit {
  jsonFlag={
    institute_id:''
  }

  salaryModel={
    salary_type:'M',
    salary_grade:'',
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
    template_id:''
  }

  template_id:any
  salrayDataList:any=[]
  addedListAllownc:any=[]
  addedListDeduct:any=[]
  template_allowances_map_dtos:any=[]
  constructor( private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService,) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
      this.salaryModel.template_id = sessionStorage.getItem('id')
    }


  ngOnInit(): void {
    this.getsalaryById()
  }
getsalaryById(){
  this.auth.showLoader();
  let url='/api/v1/payroll/template/salary/'+this.jsonFlag.institute_id+'/'+this.salaryModel.template_id
  this.http.getData(url).subscribe(
    (res :any)=>{
  this.salrayDataList=res.result
  this.auth.hideLoader();
    this.salaryModel=res.result
  
  for(let i= 0; i<this.salrayDataList.template_allowances_map_dtos.length;i++){
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
       console.log("user id",this.template_id)
      }}
    },
    err => {
      this.auth.hideLoader();
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
    }
  )
}
}
