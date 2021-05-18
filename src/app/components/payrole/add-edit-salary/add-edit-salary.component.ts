import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { Router } from '@angular/router';
import { type } from 'os';


@Component({
  selector: 'app-add-edit-salary',
  templateUrl: './add-edit-salary.component.html',
  styleUrls: ['./add-edit-salary.component.scss']
})
export class AddEditSalaryComponent implements OnInit {
  jsonFlag={
    institute_id:'',
   
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
    typeA:'A',
    typeD:'D',
    template_id:''
  }
  salrayDataList:any=[]
  template_allowances_map_dtos:any=[]
  constructor( private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService,
    private router: Router) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
    }

  ngOnInit(): void {
    this.getAllSalaryData()
  }

  getAllSalaryData(){
    this.auth.showLoader();
    let url = '/api/v1/payroll/template/salary/'+this.jsonFlag.institute_id+'/all'
    this.http.getData(url).subscribe(
      (res :any)=>{
    this.salrayDataList=res.result.response
    this.auth.hideLoader();
    console.log("salaryyyyyy",this.salrayDataList)
    for(let i =0; i< this.salrayDataList.length;i++){
      this.salaryModel.template_id = this.salrayDataList[i].template_id
    }
      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
      }
    )
    }
    addAllowonceDeduction(type){
      let obj={

        type:type,
        allowance:this.salaryModel.allowance,
        allowance_amount:this.salaryModel.allowance_amount,
        deduction:this.salaryModel.deduction,
        deduction_amount:this.salaryModel.deduction_amount
      }
      this.template_allowances_map_dtos.push(obj)
      console.log("added list",this.template_allowances_map_dtos)

  }
  createSalary(){
    let obj ={
      institute_id :this.jsonFlag.institute_id,
      salary_type:this.salaryModel.salary_type,
      salary_grade:this.salaryModel.salary_grade,
      basic_salary:this.salaryModel.basic_salary,
      overtime_rate:this.salaryModel.overtime_rate,
      template_allowances_map_dtos: this.template_allowances_map_dtos
    }
   
    this.auth.showLoader();
    let url ='/api/v1/payroll/template/salary/create'
    this.http.postData(url,obj).subscribe(
      res=>{
        this.auth.hideLoader()
        this.msgToast.showErrorMessage('success', '', "Salary added successfully");
        this.router.navigate(['/view/payrole/salary-template']);
        this.getAllSalaryData()
      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err.error.message);
      }
    )

  }

}
