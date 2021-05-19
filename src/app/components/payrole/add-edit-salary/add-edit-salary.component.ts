import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MessageShowService } from '../../../services/message-show.service';
import { Router } from '@angular/router';
import CommonUtils from './../../../utils/commonUtils'
import { AppComponent } from './../../../app.component';



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
    template_id:'',
    gross_salary:''
  }

  isEdit:boolean=false
  salrayDataList:any=[]
  addedList:any
  template_allowances_map_dtos:any=[]
  editResponce:any
  constructor( private http: HttpService, 
    private auth :AuthenticatorService,
    private msgToast :MessageShowService,
    private router: Router,
    private toastCtrl: AppComponent,) { 
      this.jsonFlag.institute_id = sessionStorage.getItem('institute_id')
     this.salaryModel.template_id=sessionStorage.getItem('id')
    }

  ngOnInit(): void {
    this.getAllSalaryData()
    this.getEditSaralyData();
    console.log("fag",this.isEdit)
    
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
      console.log("iddddd",this.salaryModel.template_id)
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
    if(this.validInput()){
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
  getEditSaralyData(){
    this.auth.showLoader();
    let url ='/api/v1/payroll/template/salary/'+this.jsonFlag.institute_id+'/'+this.salaryModel.template_id
    this.http.getData(url).subscribe(
      (res :any)=>{
        this.auth.hideLoader();
        this. editResponce = res;
        this.salaryModel.basic_salary = this.editResponce.basic_salary
        this.salaryModel.gross_salary = this.editResponce.gross_salary
        this.salaryModel.salary_grade = this.editResponce.salary_grade
        this.salaryModel.salary_type = this.editResponce.salary_type
// for(let i=0; i < this.editResponce.template_allowances_map_dtos.length;i++){
//   let obj={
//   allowance:this.editResponce.template_allowances_map_dtos[i].allowance,
//   allowance_amount:this.editResponce.template_allowances_map_dtos[i].allowance_amount,
//   deduction:this.editResponce.template_allowances_map_dtos[i].deduction,
//   deduction_amount:this.editResponce.template_allowances_map_dtos[i].deduction_amount
//   }
  // this.addedList.push(obj)
  console.log("edit",this.editResponce)
  console.log("id",this.salaryModel.template_id)
  
      },
      err => {
        this.auth.hideLoader();
        this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', err);
      }
    )
    
  }

updateSalary(){
  let obj ={
    institute_id :this.jsonFlag.institute_id,
    salary_type:this.salaryModel.salary_type,
    salary_grade:this.salaryModel.salary_grade,
    basic_salary:this.salaryModel.basic_salary,
    overtime_rate:this.salaryModel.overtime_rate,
    template_allowances_map_dtos: this.template_allowances_map_dtos
  }
  let url='/api/v1/payroll/template/salary/update'
 if(this.isEdit){
   alert(this.isEdit)
   this.auth.showLoader();
  this.http.putData(url,obj).subscribe(
      res=>{
        this.auth.hideLoader()
        this.msgToast.showErrorMessage('success', '', "Salary Updated successfully");
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






  validInput(){
    if(this.salaryModel.allowance.trim() !="" && this.salaryModel.allowance_amount ==""){
      this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Allownce_amount!');
    return;
  }
  if(this.salaryModel.allowance_amount !="" && this.salaryModel.allowance ==""){
    this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Enter Allownce!');
  return;
}
  if(this.salaryModel.overtime_rate.trim() ==""){
    this.msgToast.showErrorMessage(this.msgToast.toastTypes.error, '', 'Please Overtime Rate!');
  return;
}
    if (CommonUtils.isEmpty(this.salaryModel.salary_grade)) {
      let data = {
        type: "error",
        title: "",
        body: "Please enter Salary Grade!"
      }
      this.toastCtrl.popToast(data);
      return false;
    }
    if (CommonUtils.isEmpty(this.salaryModel.basic_salary)) {
      let data = {
        type: "error",
        title: "",
        body: "Please enter Basic Salary!"
      }
      this.toastCtrl.popToast(data);
      return false;
    }
    // if (CommonUtils.isEmpty(this.salaryModel.overtime_rate)) {
    //   let data = {
    //     type: "error",
    //     title: "",
    //     body: "Please enter Overtime Rate!"
    //   }
    //   this.toastCtrl.popToast(data);
    //   return false;
    // }

return true;
}
}